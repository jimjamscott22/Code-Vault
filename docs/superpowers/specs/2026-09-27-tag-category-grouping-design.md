# Tag Categories & Auto-Grouping — Design

## Problem

Snippets are tagged with freeform strings (`snippet.tags: string[]`), but
tags carry no higher-level grouping today. As the vault grows, related
snippets (e.g. everything tagged `python`, `docker`, `k8s`) end up scattered
through the flat snippet list/grid in whatever order they were added or last
updated, rather than sitting near other snippets of the same kind.

## Goal

Let the user define **tag categories** (e.g. "Language", "Tool", "Topic"),
assign each existing/future tag to one category, and have the snippet
list and card views automatically group snippets into sections by
category — so a snippet's position is determined by its tags' categories,
not by when it was added. No manual sorting or per-snippet grouping step
required.

## Non-goals

- Auto-detecting/inferring a tag's category from its name (e.g. pattern
  matching against the language list). Categories are always user-assigned.
- A snippet is deduplicated to a single "primary" category — a snippet with
  tags spanning multiple categories intentionally appears in every matching
  section (explicitly chosen over a single-owner model).
- Reordering/drag-and-drop of categories in this pass — categories are
  created in a fixed list, manual reordering can follow later if wanted.
- Changing the existing tag *filter* behavior in the sidebar — filtering by
  a specific tag still shows the current flat filtered list.

## Data model & backend (`crates/codevault-core/src/lib.rs`)

### Schema (migration v3)

```sql
CREATE TABLE tag_categories (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT UNIQUE NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);
ALTER TABLE tags ADD COLUMN category_id INTEGER REFERENCES tag_categories(id) ON DELETE SET NULL;
```

SQLite's `ALTER TABLE ... ADD COLUMN` doesn't support inline `ON DELETE
SET NULL` referential actions reliably across all SQLite builds bundled
via `rusqlite`'s `bundled` feature — if it's rejected, the fallback is a
plain nullable `category_id INTEGER` column with the delete-time cleanup
done explicitly in `delete_tag_category` (see below), matching how
`delete_folder` already nulls out `folder_id` by hand rather than relying
on an FK action. Either way the *behavior* is identical: deleting a
category un-categorizes its tags, it does not delete or touch snippets.

`sort_order` is assigned as `MAX(sort_order) + 1` on creation (append to
end); no reordering UI in this pass, so it only ever grows.

### Types

```rust
pub struct TagCategory {
    pub id: i64,
    pub name: String,
    pub sort_order: i64,
    pub created_at: i64,
}

pub struct NewTagCategory {
    pub name: String,
}

/// One row per known tag, with its category (if any). Distinct from
/// `Snippet.tags` (a flat Vec<String>) — this is the category lookup table
/// the frontend joins against tag names to build grouped sections.
pub struct TagWithCategory {
    pub name: String,
    pub category_id: Option<i64>,
}
```

### Functions

- `list_tag_categories(conn) -> Result<Vec<TagCategory>>` — ordered by
  `sort_order`.
- `create_tag_category(conn, input: NewTagCategory) -> Result<TagCategory>`
- `rename_tag_category(conn, id, name) -> Result<TagCategory>`
- `delete_tag_category(conn, id) -> Result<()>` — sets `category_id = NULL`
  on all tags in that category first (explicit cleanup, per the fallback
  above), then deletes the category row. Tags and snippets are untouched.
- `set_tag_category(conn, tag_name, category_id: Option<i64>) -> Result<()>`
  — looks up (or no-ops if absent) the tag by name and updates its
  `category_id`. Assigning `None` explicitly uncategorizes it.
- `list_tags_with_categories(conn) -> Result<Vec<TagWithCategory>>` —
  `SELECT name, category_id FROM tags ORDER BY name`.

No changes to `Snippet`, `SNIPPET_SELECT`, `create_snippet`, or any
existing tag function — `set_snippet_tags` keeps working exactly as today
(it only ever inserts bare tag rows with `category_id` defaulting to
`NULL`, which is correct: a brand new tag starts uncategorized until the
user assigns it in Settings).

### Tests to add (in the existing `#[cfg(test)] mod tests`)

- `tag_category_lifecycle_assigns_and_unassigns_tags` — mirrors the
  existing `folder_lifecycle_assigns_and_unassigns_snippets` test: create a
  category, assign a tag to it, delete the category, assert the tag's
  `category_id` is now `None` via `list_tags_with_categories`.
- `set_tag_category_on_unknown_tag_is_a_noop` — calling it for a tag name
  that doesn't exist in `tags` doesn't error and doesn't create a row.

## IPC layer

Per the project's four-edit rule for new backend commands:

1. **`db.rs`**: re-export the new core functions/types (`pub use
   codevault_core::*` already covers this automatically).
2. **`commands.rs`**: thin wrappers —
   `list_tag_categories`, `create_tag_category`, `rename_tag_category`,
   `delete_tag_category`, `set_tag_category`, `list_tags_with_categories` —
   each locks the `Mutex<Connection>` and maps errors to `String`, same
   shape as the existing folder commands.
3. **`lib.rs`**: register all six in the `invoke_handler!` macro.
4. **`src/lib/api.ts`**: typed wrappers, following the `tagNames`-camelCase
   → `tag_names`-snake_case convention already used by `setSnippetTags`:

```ts
listTagCategories: () => invoke<TagCategory[]>("list_tag_categories"),
createTagCategory: (name: string) => invoke<TagCategory>("create_tag_category", { input: { name } }),
renameTagCategory: (id: number, name: string) => invoke<TagCategory>("rename_tag_category", { id, name }),
deleteTagCategory: (id: number) => invoke<void>("delete_tag_category", { id }),
setTagCategory: (tagName: string, categoryId: number | null) =>
  invoke<void>("set_tag_category", { tagName, categoryId }),
listTagsWithCategories: () => invoke<TagWithCategory[]>("list_tags_with_categories"),
```

`src/lib/types.ts` gains matching `TagCategory` and `TagWithCategory`
interfaces.

## Frontend store (`src/lib/store.ts`)

New state:

```ts
tagCategories: TagCategory[];          // ordered by sort_order
tagCategoryByName: Record<string, number | null>;  // tag name -> category id (or null = uncategorized)
```

New lifecycle: `loadTagCategories()` (called alongside `loadFolders()` at
startup in `App.tsx`) fetches both `listTagCategories()` and
`listTagsWithCategories()`, populating `tagCategories` and
`tagCategoryByName`.

New actions, each following the existing folder actions' optimistic-update
+ toast-on-error pattern: `createTagCategory(name)`, `renameTagCategory(id,
name)`, `deleteTagCategory(id)` (also strips the deleted id out of
`tagCategoryByName`'s values, setting them to `null`), `setTagCategory(tagName,
categoryId)` (updates `tagCategoryByName` in place).

New computed selector:

```ts
groupedSnippets: () => { category: TagCategory | null; snippets: Snippet[] }[];
```

Implementation: start from `filteredSnippets()` (so folder/language/search
filters still apply — only the *tag* filter, when active, bypasses grouping
entirely per the "relation to filters" decision below). For each snippet,
for each of its tags, look up `tagCategoryByName[tag]`; add the snippet to
that category's bucket (dedup — a snippet with two tags in the same
category appears once in that bucket, not twice). A snippet with no tags,
or only tags with no assigned category, goes into a trailing bucket with
`category: null` ("Uncategorized"). Buckets are ordered by
`sort_order`, with the `null` bucket always last. Within a bucket, snippets
are sorted by their first matching tag name (alphabetically), then by
title, so snippets sharing a tag land contiguously without needing a
nested per-tag sub-header.

`allTags()` is unchanged (still derives flat tag strings from snippets, used
by the sidebar's tag filter chips and the new Settings tag-category
assignment list).

## UI

### Settings (`src/components/Settings.tsx`)

New `Section title="Tag categories"` block, positioned after "Default
language":

- List of existing categories, each row mirroring `FolderRow`'s
  edit-in-place/delete affordances (rename via pencil icon → inline input;
  delete via X icon — no confirmation modal, consistent with folder
  delete's un-file-not-destroy semantics since deleting a category is
  similarly non-destructive to underlying data).
- An "add category" input/button, same inline-input pattern as
  `Sidebar`'s `addingFolder`/`newFolderName` flow.
- Below that, a scrollable list of every tag from `allTags()`, each paired
  with a `<select>` of categories (plus an "Uncategorized" option) bound to
  `tagCategoryByName[tag]`, calling `setTagCategory(tag, categoryId)` on
  change. This list is the only place tag→category assignment happens;
  there's no assignment UI elsewhere (not in the snippet detail tag editor,
  to avoid scope creep — assigning categories is a deliberate, infrequent
  setup action, not a per-snippet one).

### SnippetList / SnippetCards

Both switch on whether `activeTag` is set:

- `activeTag !== null`: unchanged — render `filteredSnippets()` as today's
  flat list/grid.
- `activeTag === null`: render `groupedSnippets()`. Each bucket gets a
  small sticky-ish section header (`category?.name ?? "Uncategorized"` +
  a count badge, styled consistently with the existing `uppercase
  tracking-widest` section labels used elsewhere in the sidebar), followed
  by that bucket's snippets rendered with the existing `SnippetRow`/
  `SnippetCard` components unchanged. A category with zero snippets in the
  current filtered set is omitted entirely (no empty headers). If every
  bucket is empty (including Uncategorized), fall back to the existing
  "no snippets found" empty state.
- No collapse/expand state in this pass — sections are always expanded.
  (Flagged as a natural follow-up, not built now, per YAGNI.)

### Sidebar

No changes to the tag filter chips or their behavior — `setActiveTag`
still drives the flat/grouped switch described above from the store side.

## Data flow summary

```
tags table (+ category_id) ──┐
tag_categories table ────────┼─> list_tags_with_categories / list_tag_categories
                              │        (Tauri commands)
                              ▼
                    store.ts: tagCategoryByName, tagCategories
                              │
                              ▼
                 groupedSnippets() (derived from filteredSnippets()
                 + tagCategoryByName, recomputed on every render —
                 same "no memoization, keep handlers short" style
                 already used by filteredSnippets())
                              │
                              ▼
        SnippetList.tsx / SnippetCards.tsx render sectioned output
```

## Error handling

Follows existing conventions exactly: every new store action wraps its
`api.*` call in try/catch, logs to console, and shows `toast.error(...)`
on failure, leaving prior state untouched (no optimistic mutation before
the request succeeds, matching `createFolder`/`renameFolder`). No new error
states are introduced — a category delete or tag assignment failing just
leaves the vault in its previous, still-consistent state.

## Testing

- **Rust**: the two new unit tests described above, run via `cargo test`
  from `src-tauri/` (or wherever the crate's tests currently run from —
  matching existing test invocation).
- **Manual verification** (no frontend test suite exists in this repo):
  1. Create two categories ("Language", "Tool") in Settings, assign a
     few existing tags to each, leave some tags uncategorized.
  2. Confirm the snippet list and card view both show grouped sections in
     that category order, with an "Uncategorized" section last, and that a
     snippet with tags in two categories appears in both sections.
  3. Click a tag filter chip and confirm the view reverts to a flat
     filtered list; clear it and confirm grouping returns.
  4. Delete a category in Settings and confirm its tags fall back to
     Uncategorized without any snippet data changing, and that snippets
     remain untouched.
  5. Add a brand-new tag to a snippet and confirm it appears immediately
     under Uncategorized without a restart.

## Files touched

- `crates/codevault-core/src/lib.rs` — migration v3, new types, new
  functions, new tests.
- `src-tauri/src/commands.rs` — six new command wrappers.
- `src-tauri/src/lib.rs` — register the six commands.
- `src/lib/api.ts` — six new typed wrappers.
- `src/lib/types.ts` — `TagCategory`, `TagWithCategory` interfaces.
- `src/lib/store.ts` — new state, lifecycle, actions, `groupedSnippets()`.
- `src/App.tsx` — call `loadTagCategories()` alongside `loadFolders()` at
  startup.
- `src/components/Settings.tsx` — new "Tag categories" section.
- `src/components/SnippetList.tsx` — grouped-section rendering.
- `src/components/SnippetCards.tsx` — grouped-section rendering.
