# Tag Category Auto-Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user define tag categories, assign tags to them in Settings, and have the snippet list and card views automatically render sectioned-by-category groups instead of one flat list, so related snippets always sit near each other regardless of when they were added.

**Architecture:** A new `tag_categories` table plus a nullable `category_id` column on the existing `tags` table (migration v3), six new Tauri commands wired the same four-file way every existing command is, a `groupedSnippets()` selector added to the Zustand store that buckets `filteredSnippets()` by each snippet's tags' categories, and grouped-section rendering added to `SnippetList`/`SnippetCards` that only activates when no specific tag filter is selected.

**Tech Stack:** Rust (`rusqlite`, `anyhow`) for the core crate; React 19 + TypeScript + Zustand + Tailwind for the frontend; Tauri IPC (`invoke`) bridges them.

**Spec:** `docs/superpowers/specs/2026-09-27-tag-category-grouping-design.md`

## Global Constraints

- New migration is version **3**, appended to the `migrations` array in `crates/codevault-core/src/lib.rs` — never edit the existing `(1, ...)` or `(2, ...)` tuples.
- `tags.category_id` is a **plain nullable `INTEGER` column**, no inline `REFERENCES`/FK action. Cleanup on category delete is done explicitly (`UPDATE tags SET category_id = NULL WHERE category_id = ?1`) before the category row is deleted — mirrors how `delete_folder` already un-files snippets by hand.
- Deleting a tag category **never** deletes tags or touches snippets — only clears their `category_id`.
- Adding a backend command touches four files every time: `codevault-core/src/lib.rs` (the function itself; `db.rs`'s `pub use codevault_core::*` picks it up automatically), `src-tauri/src/commands.rs` (thin wrapper), `src-tauri/src/lib.rs` (`invoke_handler!` registration), `src/lib/api.ts` (typed wrapper). Missing the `lib.rs` registration fails at runtime, not compile time — double check it.
- Tauri auto-converts IPC argument casing: JS camelCase keys (`tagName`, `categoryId`) arrive as Rust snake_case params (`tag_name`, `category_id`). Get this right in both `api.ts`'s invoke payload keys and the Rust command's parameter names, per the existing `setSnippetTags`/`tag_names` pattern.
- There is **no frontend test framework** configured in this repo (no vitest/jest) and no plan to add one as part of this feature — `pnpm build` (runs `tsc`) is the check for every TypeScript task. Do not introduce a JS test runner.
- Rust changes are checked with `cargo test -p codevault-core` (unit tests) and `cargo check` (compile check for the Tauri crate, which has no dedicated tests here).
- Grouping only replaces the flat view when `activeTag === null`. The instant a specific tag filter is active, both `SnippetList` and `SnippetCards` fall back to today's flat `filteredSnippets()` rendering, unchanged.
- A snippet whose tags span multiple categories appears in **every** matching category's section (no single "primary tag" ownership model) but only **once per section**, even if two of its tags share that category.

## Review Focus

- A snippet with an empty `tags: []` array must still appear exactly once, under "Uncategorized" — not dropped from `groupedSnippets()` entirely. (Task 3, Task 5/6 manual check)
- Deleting a tag category that snippets are currently grouped under must move those snippets to "Uncategorized" immediately in the open list/card view, with no stale section header left behind and no app restart needed. (Task 4 manual check for the Settings dropdown falling back; Task 5/6 manual check for the list/card view updating live)
- Creating a tag category with a name that already exists (the `tag_categories.name` column is `UNIQUE`) must surface a toast error, not silently no-op or crash the app. (Task 1 Rust test + Task 4 manual check)
- A snippet with two tags that map to the same category must appear once in that category's section, not twice. (Task 3 selector logic + Task 5/6 manual check)
- Toggling a tag filter on then off must cleanly swap between the flat and grouped views with no leftover grouped-section headers rendered underneath/above the flat list. (Task 5/6 manual check)

---

## Task 1: Tag category schema and core repository functions

**Files:**
- Modify: `crates/codevault-core/src/lib.rs:51-59` (insert new structs after `SnippetPatch`)
- Modify: `crates/codevault-core/src/lib.rs:167-177` (append migration v3 tuple)
- Modify: `crates/codevault-core/src/lib.rs:357` (insert new repository functions after `set_snippet_tags`, before `row_to_folder`)
- Modify: `crates/codevault-core/src/lib.rs:984` (insert new tests before the closing `}` of `mod tests`)

**Interfaces:**
- Consumes: `Connection`, `now()`, `params!` macro — all already in scope in this file.
- Produces (for Task 2 to wrap as commands):
  - `pub struct TagCategory { pub id: i64, pub name: String, pub sort_order: i64, pub created_at: i64 }`
  - `pub struct NewTagCategory { pub name: String }`
  - `pub struct TagWithCategory { pub name: String, pub category_id: Option<i64> }`
  - `pub fn list_tag_categories(conn: &Connection) -> Result<Vec<TagCategory>>`
  - `pub fn create_tag_category(conn: &Connection, input: NewTagCategory) -> Result<TagCategory>`
  - `pub fn rename_tag_category(conn: &Connection, id: i64, name: &str) -> Result<TagCategory>`
  - `pub fn delete_tag_category(conn: &Connection, id: i64) -> Result<()>`
  - `pub fn set_tag_category(conn: &Connection, tag_name: &str, category_id: Option<i64>) -> Result<()>`
  - `pub fn list_tags_with_categories(conn: &Connection) -> Result<Vec<TagWithCategory>>`

- [ ] **Step 1: Write the failing tests**

Insert before the final `}` of `mod tests` (i.e. right after line 984, the closing brace of `folder_lifecycle_assigns_and_unassigns_snippets`):

```rust
    #[test]
    fn tag_category_lifecycle_assigns_and_unassigns_tags() {
        let conn = test_conn();
        create_snippet(&conn, sample("One")).unwrap(); // tagged "shell" by `sample()`
        let category = create_tag_category(&conn, NewTagCategory { name: "Language".to_string() }).unwrap();
        assert_eq!(category.name, "Language");
        assert_eq!(category.sort_order, 0);

        set_tag_category(&conn, "shell", Some(category.id)).unwrap();
        let tags = list_tags_with_categories(&conn).unwrap();
        let shell = tags.iter().find(|t| t.name == "shell").unwrap();
        assert_eq!(shell.category_id, Some(category.id));

        let renamed = rename_tag_category(&conn, category.id, "Languages").unwrap();
        assert_eq!(renamed.name, "Languages");

        delete_tag_category(&conn, category.id).unwrap();
        assert!(list_tag_categories(&conn).unwrap().is_empty());
        let tags = list_tags_with_categories(&conn).unwrap();
        let shell = tags.iter().find(|t| t.name == "shell").unwrap();
        assert_eq!(shell.category_id, None);
    }

    #[test]
    fn set_tag_category_on_unknown_tag_is_a_noop() {
        let conn = test_conn();
        let category = create_tag_category(&conn, NewTagCategory { name: "Tool".to_string() }).unwrap();
        set_tag_category(&conn, "does-not-exist", Some(category.id)).unwrap();
        assert!(list_tags_with_categories(&conn).unwrap().is_empty());
    }

    #[test]
    fn create_tag_category_rejects_duplicate_name() {
        let conn = test_conn();
        create_tag_category(&conn, NewTagCategory { name: "Topic".to_string() }).unwrap();
        let result = create_tag_category(&conn, NewTagCategory { name: "Topic".to_string() });
        assert!(result.is_err());
    }
```

- [ ] **Step 2: Run the tests to verify they fail to compile**

Run (from the repo root): `cargo test -p codevault-core tag_category`
Expected: compile error — `TagCategory`, `NewTagCategory`, `create_tag_category`, etc. are not defined yet.

- [ ] **Step 3: Add the new types**

In `crates/codevault-core/src/lib.rs`, insert immediately after the `SnippetPatch` struct (after line 59, before the `// Helpers` section comment):

```rust
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TagCategory {
    pub id: i64,
    pub name: String,
    pub sort_order: i64,
    pub created_at: i64,
}

#[derive(Debug, Deserialize)]
pub struct NewTagCategory {
    pub name: String,
}

/// One row per known tag, with its category (if any). Distinct from
/// `Snippet.tags` (a flat `Vec<String>`) — this is the lookup table the
/// frontend joins against tag names to build grouped sections.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TagWithCategory {
    pub name: String,
    pub category_id: Option<i64>,
}
```

- [ ] **Step 4: Add migration v3**

In the `migrations` array (currently the two tuples `(1, ...)` and `(2, ...)`, ending at line 176 with `);`), append a third tuple right before the array's closing `];`:

```rust
        (
            3,
            "CREATE TABLE IF NOT EXISTS tag_categories (
                 id         INTEGER PRIMARY KEY AUTOINCREMENT,
                 name       TEXT UNIQUE NOT NULL,
                 sort_order INTEGER NOT NULL,
                 created_at INTEGER NOT NULL
             );
             ALTER TABLE tags ADD COLUMN category_id INTEGER;",
        ),
```

- [ ] **Step 5: Add the repository functions**

Insert immediately after `set_snippet_tags`'s closing `}` (after line 357), before `fn row_to_folder`:

```rust
fn row_to_tag_category(row: &rusqlite::Row<'_>) -> rusqlite::Result<TagCategory> {
    Ok(TagCategory {
        id: row.get(0)?,
        name: row.get(1)?,
        sort_order: row.get(2)?,
        created_at: row.get(3)?,
    })
}

pub fn list_tag_categories(conn: &Connection) -> Result<Vec<TagCategory>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, sort_order, created_at FROM tag_categories ORDER BY sort_order",
    )?;
    let rows = stmt.query_map([], row_to_tag_category)?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

fn get_tag_category(conn: &Connection, id: i64) -> Result<TagCategory> {
    conn.query_row(
        "SELECT id, name, sort_order, created_at FROM tag_categories WHERE id = ?1",
        params![id],
        row_to_tag_category,
    )
    .with_context(|| format!("tag category {id} not found"))
}

pub fn create_tag_category(conn: &Connection, input: NewTagCategory) -> Result<TagCategory> {
    let name = input.name.trim();
    let next_sort_order: i64 = conn.query_row(
        "SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tag_categories",
        [],
        |r| r.get(0),
    )?;
    conn.execute(
        "INSERT INTO tag_categories (name, sort_order, created_at) VALUES (?1, ?2, ?3)",
        params![name, next_sort_order, now()],
    )?;
    get_tag_category(conn, conn.last_insert_rowid())
}

pub fn rename_tag_category(conn: &Connection, id: i64, name: &str) -> Result<TagCategory> {
    conn.execute(
        "UPDATE tag_categories SET name = ?1 WHERE id = ?2",
        params![name.trim(), id],
    )?;
    get_tag_category(conn, id)
}

/// Delete a tag category. Tags that belonged to it become uncategorized
/// (`category_id` set to NULL) rather than being deleted themselves, and
/// snippets are untouched — mirrors `delete_folder`'s un-filing of snippets.
pub fn delete_tag_category(conn: &Connection, id: i64) -> Result<()> {
    conn.execute(
        "UPDATE tags SET category_id = NULL WHERE category_id = ?1",
        params![id],
    )?;
    conn.execute("DELETE FROM tag_categories WHERE id = ?1", params![id])?;
    Ok(())
}

/// Assign `tag_name` to `category_id` (`None` uncategorizes it). No-ops
/// silently if the tag doesn't exist yet (nothing to assign a category to).
pub fn set_tag_category(conn: &Connection, tag_name: &str, category_id: Option<i64>) -> Result<()> {
    conn.execute(
        "UPDATE tags SET category_id = ?1 WHERE name = ?2",
        params![category_id, tag_name],
    )?;
    Ok(())
}

pub fn list_tags_with_categories(conn: &Connection) -> Result<Vec<TagWithCategory>> {
    let mut stmt = conn.prepare("SELECT name, category_id FROM tags ORDER BY name")?;
    let rows = stmt.query_map([], |row| {
        Ok(TagWithCategory {
            name: row.get(0)?,
            category_id: row.get(1)?,
        })
    })?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `cargo test -p codevault-core tag_category`
Expected: `test tests::tag_category_lifecycle_assigns_and_unassigns_tags ... ok`, `test tests::set_tag_category_on_unknown_tag_is_a_noop ... ok`, `test tests::create_tag_category_rejects_duplicate_name ... ok`

- [ ] **Step 7: Run the full core test suite to confirm nothing else broke**

Run: `cargo test -p codevault-core`
Expected: all tests pass, including the pre-existing ones (migration v3 must not break v1/v2's `folder_lifecycle_assigns_and_unassigns_snippets` or any import/export test).

- [ ] **Step 8: Commit**

```bash
git add crates/codevault-core/src/lib.rs
git commit -m "feat(core): add tag categories schema and repository functions"
```

---

## Task 2: Wire tag category commands through Tauri IPC

**Files:**
- Modify: `src-tauri/src/commands.rs` (add six `#[tauri::command]` wrappers, extend the `use crate::db::{...}` import line)
- Modify: `src-tauri/src/lib.rs:19-39` (register the six new commands in `invoke_handler!`)
- Modify: `src/lib/types.ts` (add `TagCategory`, `NewTagCategory`, `TagWithCategory` interfaces)
- Modify: `src/lib/api.ts` (add six typed wrappers)

**Interfaces:**
- Consumes: `TagCategory`, `NewTagCategory`, `TagWithCategory`, `list_tag_categories`, `create_tag_category`, `rename_tag_category`, `delete_tag_category`, `set_tag_category`, `list_tags_with_categories` from Task 1.
- Produces (for Task 3):
  - `api.listTagCategories(): Promise<TagCategory[]>`
  - `api.createTagCategory(name: string): Promise<TagCategory>`
  - `api.renameTagCategory(id: number, name: string): Promise<TagCategory>`
  - `api.deleteTagCategory(id: number): Promise<void>`
  - `api.setTagCategory(tagName: string, categoryId: number | null): Promise<void>`
  - `api.listTagsWithCategories(): Promise<TagWithCategory[]>`

- [ ] **Step 1: Add the Rust command wrappers**

In `src-tauri/src/commands.rs`, change the import line (line 3) from:

```rust
use crate::db::{self, Folder, ImportResult, MarkdownDirResult, NewFolder, NewSnippet, Snippet, SnippetPatch};
```

to:

```rust
use crate::db::{
    self, Folder, ImportResult, MarkdownDirResult, NewFolder, NewSnippet, NewTagCategory,
    Snippet, SnippetPatch, TagCategory, TagWithCategory,
};
```

Then append these six commands at the end of the file (after `import_markdown_dir`):

```rust
#[tauri::command]
pub fn list_tag_categories(state: State<'_, DbState>) -> CmdResult<Vec<TagCategory>> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::list_tag_categories(&conn).map_err(e)
}

#[tauri::command]
pub fn create_tag_category(state: State<'_, DbState>, input: NewTagCategory) -> CmdResult<TagCategory> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::create_tag_category(&conn, input).map_err(e)
}

#[tauri::command]
pub fn rename_tag_category(state: State<'_, DbState>, id: i64, name: String) -> CmdResult<TagCategory> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::rename_tag_category(&conn, id, &name).map_err(e)
}

#[tauri::command]
pub fn delete_tag_category(state: State<'_, DbState>, id: i64) -> CmdResult<()> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::delete_tag_category(&conn, id).map_err(e)
}

#[tauri::command]
pub fn set_tag_category(
    state: State<'_, DbState>,
    tag_name: String,
    category_id: Option<i64>,
) -> CmdResult<()> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::set_tag_category(&conn, &tag_name, category_id).map_err(e)
}

#[tauri::command]
pub fn list_tags_with_categories(state: State<'_, DbState>) -> CmdResult<Vec<TagWithCategory>> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::list_tags_with_categories(&conn).map_err(e)
}
```

- [ ] **Step 2: Register the commands in `lib.rs`**

In `src-tauri/src/lib.rs`, inside the `tauri::generate_handler![...]` list (lines 19-39), add these six lines right after `commands::import_markdown_dir,`:

```rust
            commands::list_tag_categories,
            commands::create_tag_category,
            commands::rename_tag_category,
            commands::delete_tag_category,
            commands::set_tag_category,
            commands::list_tags_with_categories,
```

- [ ] **Step 3: Run `cargo check` to verify the Rust side compiles**

Run: `cd src-tauri && cargo check`
Expected: no errors. (If it fails with "command not found in scope" or similar, the most common cause per this codebase's own notes is a missing `lib.rs` registration — check Step 2.)

- [ ] **Step 4: Add the TypeScript types**

In `src/lib/types.ts`, add after the existing `Tag` interface (after line 4):

```ts
export interface TagCategory {
  id: number;
  name: string;
  sort_order: number;
  created_at: number;
}

export interface NewTagCategory {
  name: string;
}

export interface TagWithCategory {
  name: string;
  category_id: number | null;
}
```

- [ ] **Step 5: Add the typed API wrappers**

In `src/lib/api.ts`, update the type import (line 2) to include the three new types:

```ts
import { invoke } from "@tauri-apps/api/core";
import type {
  Folder,
  ImportResult,
  ImportStrategy,
  MarkdownDirResult,
  NewFolder,
  NewSnippet,
  NewTagCategory,
  Snippet,
  SnippetPatch,
  TagCategory,
  TagWithCategory,
} from "./types";
```

Then add these six entries to the `api` object (after `importMarkdownDir`, before the closing `};`):

```ts
  listTagCategories: () =>
    invoke<TagCategory[]>("list_tag_categories"),

  createTagCategory: (name: string) =>
    invoke<TagCategory>("create_tag_category", { input: { name } as NewTagCategory }),

  renameTagCategory: (id: number, name: string) =>
    invoke<TagCategory>("rename_tag_category", { id, name }),

  deleteTagCategory: (id: number) =>
    invoke<void>("delete_tag_category", { id }),

  setTagCategory: (tagName: string, categoryId: number | null) =>
    invoke<void>("set_tag_category", { tagName, categoryId }),

  listTagsWithCategories: () =>
    invoke<TagWithCategory[]>("list_tags_with_categories"),
```

- [ ] **Step 6: Run the frontend type check**

Run: `pnpm build`
Expected: `tsc` reports no errors (the build will fail later at the Vite step only if something else is broken; the type-check portion is what this step verifies — if `tsc` itself reports zero errors, this step's goal is met even if you stop there).

- [ ] **Step 7: Commit**

```bash
git add src-tauri/src/commands.rs src-tauri/src/lib.rs src/lib/types.ts src/lib/api.ts
git commit -m "feat: wire tag category commands through Tauri IPC"
```

---

## Task 3: Store state, actions, and the `groupedSnippets()` selector

**Files:**
- Modify: `src/lib/store.ts` (new state, lifecycle action, CRUD actions, `groupedSnippets()` selector)
- Modify: `src/App.tsx` (call `loadTagCategories()` on mount alongside `loadFolders()`)

**Interfaces:**
- Consumes: `api.listTagCategories`, `api.createTagCategory`, `api.renameTagCategory`, `api.deleteTagCategory`, `api.setTagCategory`, `api.listTagsWithCategories` from Task 2; `TagCategory`, `TagWithCategory` types from Task 2.
- Produces (for Task 4, 5, 6):
  - `useVaultStore().tagCategories: TagCategory[]`
  - `useVaultStore().tagCategoryByName: Record<string, number | null>`
  - `useVaultStore().loadTagCategories(): Promise<void>`
  - `useVaultStore().createTagCategory(name: string): Promise<void>`
  - `useVaultStore().renameTagCategory(id: number, name: string): Promise<void>`
  - `useVaultStore().deleteTagCategory(id: number): Promise<void>`
  - `useVaultStore().setTagCategory(tagName: string, categoryId: number | null): Promise<void>`
  - `useVaultStore().groupedSnippets(): { category: TagCategory | null; snippets: Snippet[] }[]`

There is no frontend test runner in this repo (see Global Constraints), so this task's automated gate is the TypeScript compiler; `groupedSnippets()`'s actual bucketing/sorting/dedup behavior is exercised end-to-end by Task 5 and Task 6's manual verification steps, which explicitly cover the zero-tags and multi-category-tags cases called out in Review Focus.

- [ ] **Step 1: Add imports and state fields**

In `src/lib/store.ts`, update the type import (line 5) from:

```ts
import type { Folder, Snippet, SnippetPatch } from "./types";
```

to:

```ts
import type { Folder, Snippet, SnippetPatch, TagCategory } from "./types";
```

In the `VaultState` interface, add after `folders: Folder[];` (line 13):

```ts
  tagCategories: TagCategory[];
  /** tag name -> category id, or `null` for an uncategorized (known) tag */
  tagCategoryByName: Record<string, number | null>;
```

And add to the interface's method declarations, after `loadFolders: () => Promise<void>;` (line 29):

```ts
  loadTagCategories: () => Promise<void>;
```

after `deleteFolder: (id: number) => Promise<void>;` (line 54):

```ts
  createTagCategory: (name: string) => Promise<void>;
  renameTagCategory: (id: number, name: string) => Promise<void>;
  deleteTagCategory: (id: number) => Promise<void>;
  setTagCategory: (tagName: string, categoryId: number | null) => Promise<void>;
```

and after `allTags: () => string[];` (line 59):

```ts
  groupedSnippets: () => { category: TagCategory | null; snippets: Snippet[] }[];
```

- [ ] **Step 2: Initialize the new state**

In the store's initial state object, add after `folders: [],` (line 64):

```ts
  tagCategories: [],
  tagCategoryByName: {},
```

- [ ] **Step 3: Add `loadTagCategories`**

Add after the `loadFolders` implementation (after its closing `},` at line 96):

```ts
  loadTagCategories: async () => {
    try {
      const [tagCategories, tagsWithCategories] = await Promise.all([
        api.listTagCategories(),
        api.listTagsWithCategories(),
      ]);
      const tagCategoryByName: Record<string, number | null> = {};
      tagsWithCategories.forEach((t) => {
        tagCategoryByName[t.name] = t.category_id;
      });
      set({ tagCategories, tagCategoryByName });
    } catch (err) {
      console.error("loadTagCategories:", err);
      toast.error(`Failed to load tag categories: ${err}`);
    }
  },
```

- [ ] **Step 4: Add the CRUD actions**

Add after the `deleteFolder` implementation's closing `},` (currently ending at line 238, right before `filteredSnippets: () => {`):

```ts
  createTagCategory: async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const category = await api.createTagCategory(trimmed);
      set((s) => ({ tagCategories: [...s.tagCategories, category] }));
    } catch (err) {
      console.error("createTagCategory:", err);
      toast.error(`Failed to create tag category: ${err}`);
    }
  },

  renameTagCategory: async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const category = await api.renameTagCategory(id, trimmed);
      set((s) => ({
        tagCategories: s.tagCategories.map((c) => (c.id === id ? category : c)),
      }));
    } catch (err) {
      console.error("renameTagCategory:", err);
      toast.error(`Failed to rename tag category: ${err}`);
    }
  },

  deleteTagCategory: async (id) => {
    try {
      await api.deleteTagCategory(id);
      set((s) => ({
        tagCategories: s.tagCategories.filter((c) => c.id !== id),
        tagCategoryByName: Object.fromEntries(
          Object.entries(s.tagCategoryByName).map(([tag, catId]) => [
            tag,
            catId === id ? null : catId,
          ]),
        ),
      }));
      toast.success("Tag category deleted");
    } catch (err) {
      console.error("deleteTagCategory:", err);
      toast.error(`Failed to delete tag category: ${err}`);
    }
  },

  setTagCategory: async (tagName, categoryId) => {
    try {
      await api.setTagCategory(tagName, categoryId);
      set((s) => ({
        tagCategoryByName: { ...s.tagCategoryByName, [tagName]: categoryId },
      }));
    } catch (err) {
      console.error("setTagCategory:", err);
      toast.error(`Failed to update tag category: ${err}`);
    }
  },
```

- [ ] **Step 5: Add the `groupedSnippets()` selector**

Add after `allTags` (after its closing `},` — the last selector, right before the store's closing `}));`):

```ts
  groupedSnippets: () => {
    const { tagCategories, tagCategoryByName } = get();
    const snippets = get().filteredSnippets();

    const buckets = new Map<number | null, Snippet[]>();
    for (const snippet of snippets) {
      const categoryIds = new Set<number | null>();
      for (const tag of snippet.tags) {
        categoryIds.add(tagCategoryByName[tag] ?? null);
      }
      if (categoryIds.size === 0) categoryIds.add(null);
      for (const categoryId of categoryIds) {
        const bucket = buckets.get(categoryId);
        if (bucket) bucket.push(snippet);
        else buckets.set(categoryId, [snippet]);
      }
    }

    const sortBucket = (categoryId: number | null, items: Snippet[]) => {
      const matchingTags = new Set(
        Object.entries(tagCategoryByName)
          .filter(([, id]) => id === categoryId)
          .map(([tag]) => tag),
      );
      const firstMatchingTag = (s: Snippet) =>
        s.tags.find((t) => matchingTags.has(t)) ?? "";
      return [...items].sort((a, b) => {
        const cmp = firstMatchingTag(a).localeCompare(firstMatchingTag(b));
        return cmp !== 0 ? cmp : a.title.localeCompare(b.title);
      });
    };

    const result: { category: TagCategory | null; snippets: Snippet[] }[] = [];
    for (const category of tagCategories) {
      const items = buckets.get(category.id);
      if (items?.length) result.push({ category, snippets: sortBucket(category.id, items) });
    }
    const uncategorized = buckets.get(null);
    if (uncategorized?.length) result.push({ category: null, snippets: sortBucket(null, uncategorized) });

    return result;
  },
```

- [ ] **Step 6: Wire `loadTagCategories` into app startup**

In `src/App.tsx`, add the selector and call it alongside the existing ones:

```tsx
import { useEffect } from "react";
import "./App.css";
import Layout from "./components/Layout";
import { useVaultStore } from "./lib/store";

export default function App() {
  const loadSnippets = useVaultStore((s) => s.loadSnippets);
  const loadFolders = useVaultStore((s) => s.loadFolders);
  const loadTagCategories = useVaultStore((s) => s.loadTagCategories);

  useEffect(() => {
    loadSnippets();
    loadFolders();
    loadTagCategories();
  }, [loadSnippets, loadFolders, loadTagCategories]);

  return <Layout />;
}
```

- [ ] **Step 7: Run the type check**

Run: `pnpm build`
Expected: no `tsc` errors. Pay particular attention to the `Map<number | null, Snippet[]>` and `Set<number | null>` usages in `groupedSnippets` — TypeScript must accept `null` as a `Map`/`Set` key type here without a cast.

- [ ] **Step 8: Commit**

```bash
git add src/lib/store.ts src/App.tsx
git commit -m "feat: add tag category store state and groupedSnippets selector"
```

---

## Task 4: Tag category management UI in Settings

**Files:**
- Modify: `src/components/Settings.tsx`

**Interfaces:**
- Consumes: `useVaultStore().tagCategories`, `.tagCategoryByName`, `.createTagCategory`, `.renameTagCategory`, `.deleteTagCategory`, `.setTagCategory`, `.allTags` from Task 3.
- Produces: nothing new consumed by later tasks — this is a leaf UI task.

- [ ] **Step 1: Add the `useRef` import and new store selectors**

In `src/components/Settings.tsx`, change line 1 from:

```tsx
import { useEffect, useState } from "react";
```

to:

```tsx
import { useEffect, useRef, useState } from "react";
```

Then inside the `Settings` component, add after the existing `loadSnippets` selector (after line 14):

```tsx
  const tagCategories = useVaultStore((s) => s.tagCategories);
  const tagCategoryByName = useVaultStore((s) => s.tagCategoryByName);
  const createTagCategory = useVaultStore((s) => s.createTagCategory);
  const renameTagCategory = useVaultStore((s) => s.renameTagCategory);
  const deleteTagCategory = useVaultStore((s) => s.deleteTagCategory);
  const setTagCategory = useVaultStore((s) => s.setTagCategory);
  const allTags = useVaultStore((s) => s.allTags);
```

- [ ] **Step 2: Add local state for the "add category" input**

Add after the existing `const [busy, setBusy] = useState(false);` (line 21):

```tsx
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // See Sidebar's addFolderSettledRef: guards against a double-submit when
  // unmounting this input on Enter fires a stale-closure blur afterward.
  const addCategorySettledRef = useRef(false);

  const openAddCategory = () => {
    addCategorySettledRef.current = false;
    setNewCategoryName("");
    setAddingCategory(true);
  };

  const submitNewCategory = () => {
    if (addCategorySettledRef.current) return;
    addCategorySettledRef.current = true;
    const trimmed = newCategoryName.trim();
    if (trimmed) createTagCategory(trimmed);
    setNewCategoryName("");
    setAddingCategory(false);
  };

  const cancelNewCategory = () => {
    addCategorySettledRef.current = true;
    setNewCategoryName("");
    setAddingCategory(false);
  };
```

- [ ] **Step 3: Add the `TagCategoryRow` helper component**

Add this new function above the `Settings` default export (before `export default function Settings()`):

```tsx
function TagCategoryRow({
  name,
  onRename,
  onDelete,
}: {
  name: string;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const settledRef = useRef(false);

  const startEditing = () => {
    settledRef.current = false;
    setValue(name);
    setEditing(true);
  };

  const commitRename = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) onRename(trimmed);
    setEditing(false);
  };

  const cancelRename = () => {
    settledRef.current = true;
    setValue(name);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") cancelRename();
        }}
        className="w-full bg-zinc-800 border border-emerald-700 text-zinc-200 text-xs rounded px-2 py-1.5 outline-none"
      />
    );
  }

  return (
    <div className="group flex items-center gap-2 px-2 py-1.5 rounded text-xs bg-zinc-800/50">
      <span className="flex-1 min-w-0 truncate text-zinc-300">{name}</span>
      <button
        onClick={startEditing}
        className="flex-shrink-0 hidden group-hover:block text-zinc-500 hover:text-zinc-200"
        title="Rename category"
      >
        ✎
      </button>
      <button
        onClick={onDelete}
        className="flex-shrink-0 hidden group-hover:block text-zinc-500 hover:text-red-400"
        title="Delete category"
      >
        ✕
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Add the "Tag categories" section**

In the JSX returned by `Settings`, add a new `Section` after the "Default language" section (after its closing `</Section>`, before the "Import / export" `Section`):

```tsx
          {/* Tag categories */}
          <Section
            title="Tag categories"
            hint="Group tags into categories (e.g. Language, Tool, Topic) so the snippet list and card view auto-sort into sections by tag. Uncategorized tags fall into their own section."
          >
            <div className="space-y-3">
              {tagCategories.length > 0 && (
                <div className="flex flex-col gap-1">
                  {tagCategories.map((category) => (
                    <TagCategoryRow
                      key={category.id}
                      name={category.name}
                      onRename={(name) => renameTagCategory(category.id, name)}
                      onDelete={() => deleteTagCategory(category.id)}
                    />
                  ))}
                </div>
              )}

              {addingCategory ? (
                <input
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onBlur={submitNewCategory}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitNewCategory();
                    if (e.key === "Escape") cancelNewCategory();
                  }}
                  placeholder="category name"
                  className="w-full bg-zinc-800 border border-emerald-700 text-zinc-200 text-xs rounded px-2 py-1.5 outline-none placeholder-zinc-600"
                />
              ) : (
                <Btn onClick={openAddCategory}>+ new category</Btn>
              )}

              {allTags().length > 0 && (
                <div className="pt-2 border-t border-zinc-800 space-y-1.5 max-h-48 overflow-y-auto">
                  {allTags().map((tag) => (
                    <div key={tag} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-zinc-400 truncate">#{tag}</span>
                      <select
                        value={tagCategoryByName[tag] ?? ""}
                        onChange={(e) =>
                          setTagCategory(tag, e.target.value === "" ? null : Number(e.target.value))
                        }
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-1.5 py-1 outline-none focus:border-emerald-700 cursor-pointer flex-shrink-0"
                      >
                        <option value="">Uncategorized</option>
                        {tagCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
```

- [ ] **Step 5: Run the type check**

Run: `pnpm build`
Expected: no `tsc` errors.

- [ ] **Step 6: Manual verification**

Run: `pnpm tauri dev`

1. Open Settings (gear icon). Confirm the new "Tag categories" section renders below "Default language".
2. Click "+ new category", type "Language", press Enter. Confirm it appears in the category list.
3. Add a second category, "Tool".
4. Try creating a third category named "Language" again (duplicate). Confirm a toast error appears (e.g. "Failed to create tag category: ...") and no duplicate row is added — this is the Review Focus item about `UNIQUE` constraint violations surfacing as errors, not silent no-ops.
5. Scroll to the tag list below the categories. Pick an existing tag and assign it to "Language" via its dropdown. Reopen Settings (close and reopen) and confirm the assignment persisted.
6. Rename "Tool" to "Tools" via the pencil icon. Confirm the tag dropdown options update to show "Tools".
7. Delete the "Tools" category via the ✕ icon. Confirm it disappears from the category list and any tag that was assigned to it now shows "Uncategorized" in its dropdown.

- [ ] **Step 7: Commit**

```bash
git add src/components/Settings.tsx
git commit -m "feat: add tag category management UI to Settings"
```

---

## Task 5: Grouped rendering in the snippet list view

**Files:**
- Modify: `src/components/SnippetList.tsx`

**Interfaces:**
- Consumes: `useVaultStore().activeTag`, `.filteredSnippets`, `.groupedSnippets` from Task 3; existing `SnippetRow` component (unchanged).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Extract the empty-state JSX into a helper**

In `src/components/SnippetList.tsx`, add this function after the existing `StarIcon` function and before `SnippetRow`:

```tsx
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center">
      <span className="text-2xl mb-2">◌</span>
      no snippets found
    </div>
  );
}
```

- [ ] **Step 2: Replace the default export with tag-filter-aware, grouped rendering**

Replace the current `SnippetList` function (from `export default function SnippetList() {` to its closing `}`) with:

```tsx
export default function SnippetList() {
  const { selectedId, selectSnippet, filteredSnippets, groupedSnippets, activeTag } = useVaultStore();

  if (activeTag) {
    const snippets = filteredSnippets();
    if (snippets.length === 0) return <EmptyState />;
    return (
      <div className="overflow-y-auto h-full">
        {snippets.map((s) => (
          <SnippetRow
            key={s.id}
            snippet={s}
            selected={s.id === selectedId}
            onClick={() => selectSnippet(s.id)}
          />
        ))}
      </div>
    );
  }

  const groups = groupedSnippets();
  if (groups.length === 0) return <EmptyState />;

  return (
    <div className="overflow-y-auto h-full">
      {groups.map(({ category, snippets }) => (
        <div key={category?.id ?? "uncategorized"}>
          <div className="px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/80">
            <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-widest">
              {category?.name ?? "Uncategorized"}
            </span>
            <span className="text-zinc-600 font-mono text-[11px] ml-1.5">{snippets.length}</span>
          </div>
          {snippets.map((s) => (
            <SnippetRow
              key={s.id}
              snippet={s}
              selected={s.id === selectedId}
              onClick={() => selectSnippet(s.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Run the type check**

Run: `pnpm build`
Expected: no `tsc` errors.

- [ ] **Step 4: Manual verification**

Run: `pnpm tauri dev` (skip if still running from Task 4).

1. With at least one tag assigned to a category (from Task 4) and at least one snippet tagged with it, confirm the list view (not card view) shows section headers with category names and per-section counts.
2. Create or tag a snippet with no tags at all. Confirm it shows up under an "Uncategorized" section header — this is the Review Focus item about zero-tag snippets not being dropped.
3. Tag one snippet with two tags that map to two different categories (from Task 4's assignments). Confirm the same snippet appears under both category sections, not just one.
4. Tag one snippet with two tags that map to the *same* category. Confirm it appears only once in that section, not twice.
5. Click a tag chip in the sidebar to activate a tag filter. Confirm the view immediately switches to a flat list with no section headers at all.
6. Click the same tag chip again to clear the filter. Confirm the grouped view returns with no leftover flat-list artifacts.
7. In Settings, delete a category that has snippets currently grouped under it (from Task 4). Confirm those snippets move to "Uncategorized" in the list view without needing to restart the app.

- [ ] **Step 5: Commit**

```bash
git add src/components/SnippetList.tsx
git commit -m "feat: group snippet list into tag-category sections"
```

---

## Task 6: Grouped rendering in the card view

**Files:**
- Modify: `src/components/SnippetCards.tsx`

**Interfaces:**
- Consumes: `useVaultStore().activeTag`, `.filteredSnippets`, `.groupedSnippets` from Task 3; existing `SnippetCard` component (unchanged).
- Produces: nothing consumed by later tasks. This is the final task.

- [ ] **Step 1: Extract shared grid and empty-state helpers**

In `src/components/SnippetCards.tsx`, add these two functions after the existing `SnippetCard` function and before the default export:

```tsx
function CardGrid({
  snippets,
  selectedId,
  onOpen,
}: {
  snippets: Snippet[];
  selectedId: number | null;
  onOpen: (id: number) => void;
}) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
      {snippets.map((s) => (
        <SnippetCard key={s.id} snippet={s} selected={s.id === selectedId} onOpen={() => onOpen(s.id)} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center bg-zinc-950">
      <span className="text-2xl mb-2">◌</span>
      no snippets found
    </div>
  );
}
```

- [ ] **Step 2: Replace the default export with tag-filter-aware, grouped rendering**

Replace the current `SnippetCards` function (from `export default function SnippetCards() {` to its closing `}`) with:

```tsx
export default function SnippetCards() {
  const { selectedId, selectSnippet, filteredSnippets, groupedSnippets, activeTag } = useVaultStore();
  const setViewMode = useSettingsStore((s) => s.setViewMode);

  const openCard = (id: number) => {
    selectSnippet(id);
    setViewMode("list");
  };

  if (activeTag) {
    const snippets = filteredSnippets();
    if (snippets.length === 0) return <EmptyState />;
    return (
      <div className="h-full overflow-y-auto bg-zinc-950 p-5">
        <CardGrid snippets={snippets} selectedId={selectedId} onOpen={openCard} />
      </div>
    );
  }

  const groups = groupedSnippets();
  if (groups.length === 0) return <EmptyState />;

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 p-5 space-y-6">
      {groups.map(({ category, snippets }) => (
        <div key={category?.id ?? "uncategorized"}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              {category?.name ?? "Uncategorized"}
            </span>
            <span className="text-zinc-600 font-mono text-xs">{snippets.length}</span>
          </div>
          <CardGrid snippets={snippets} selectedId={selectedId} onOpen={openCard} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Run the type check**

Run: `pnpm build`
Expected: no `tsc` errors.

- [ ] **Step 4: Manual verification**

Run: `pnpm tauri dev` (skip if still running), then switch to card view (grid icon in the sidebar header, or Ctrl+G).

1. Repeat Task 5's manual checks 1-7 in card view instead of list view: category section headers with counts, an "Uncategorized" section for a zero-tag snippet, a two-category snippet appearing in both sections, a same-category-two-tags snippet appearing once, flat view on tag-filter activation, grouped view returning on filter clear, and a deleted category's snippets falling back to "Uncategorized" live.
2. Confirm opening a card (clicking it) still switches to list view and selects that snippet, unchanged from current behavior.

- [ ] **Step 5: Commit**

```bash
git add src/components/SnippetCards.tsx
git commit -m "feat: group snippet card view into tag-category sections"
```
