# Performance Review Notes

A pass over the codebase after adding folder organization, looking for
optimization opportunities. Findings are rated for impact assuming CodeVault's
actual usage profile: a local-first, single-user desktop app with a vault in
the hundreds-to-low-thousands of snippets, not a high-concurrency server or a
dataset in the millions of rows. Most SQL-level micro-optimizations are Low
impact at that scale — the frontend re-render patterns matter more since they
run on every keystroke.

## SQL / DB layer

- **`search_snippets` is dead code** (`crates/codevault-core/src/lib.rs`,
  wrapped in `src-tauri/src/commands.rs` and `src/lib/api.ts`). Nothing in the
  frontend calls `api.searchSnippets` — all search/filtering happens
  client-side in `store.ts`'s `filteredSnippets()`. *Low impact, but worth
  either wiring it up or removing it* — it's a full duplicate code path that's
  never exercised by the UI.
- **No index on `snippets.updated_at`**, the sort column for every
  `list_snippets` call (`ORDER BY s.updated_at DESC`). *Low impact* at
  thousands of rows (SQLite sorts that in-memory in well under a millisecond),
  but it's the one index that would actually start to matter if a vault grows
  into the tens of thousands of snippets.
- **`set_snippet_tags` does 3 round-trip statements per tag** (insert-or-ignore
  the tag, select its id, insert-or-ignore the join row) instead of a single
  `INSERT ... SELECT`. *Low impact* — snippets typically have a handful of
  tags, so this is at most ~15-30 tiny statements against a local SQLite file.
- **No `PRAGMA synchronous` override** — WAL mode is set, but `synchronous`
  defaults to `FULL`, which fsyncs on every commit. *Low impact* for occasional
  saves, but `PRAGMA synchronous=NORMAL` (still durable under WAL) is a
  one-line change that shaves a few ms off each autosave on slower disks.
- **Single `Mutex<Connection>`** serializes all commands. *No real impact* —
  this is a single-user app with no concurrent command load; the design is
  appropriate as-is.
- The `SNIPPET_SELECT` join/`GROUP_CONCAT` pattern and the new
  `idx_snippets_folder_id` index are both fine as they stand.

## Frontend state & rendering

- **Whole-store subscriptions cause unrelated re-renders.**
  `SnippetList.tsx` and `Sidebar.tsx` both call `useVaultStore()` with no
  selector, so they re-render on *every* store change — including each
  keystroke while editing a snippet's code or notes, since that updates
  `snippets` via the autosave path. *Medium impact*: this re-runs
  `filteredSnippets()`, `allTags()`, and the language/folder-count derivations
  far more often than needed. Selecting only the specific slices each
  component needs (e.g. `useVaultStore((s) => s.filteredSnippets())` alongside
  narrower field selectors) would cut this down.
- **`CodeEditor.tsx` rebuilds its `extensions` array on every render** instead
  of memoizing on `language`. Combined with the whole-store re-render above,
  this means CodeMirror gets a new `extensions` array reference on every
  keystroke in the editor — the single hottest interaction in the app.
  *Medium impact* — wrapping `langExt`/`extensions` in `useMemo(() => ..., [language])`
  is a small, safe fix.
- **`Sidebar.tsx`'s per-folder snippet count** (`snippets.filter(s => s.folder_id === f.id).length`
  inside `folders.map(...)`) is an O(snippets × folders) scan recomputed every
  render. *Low impact* at realistic scale (still sub-millisecond with hundreds
  of snippets and a handful of folders), but a single grouped-count pass would
  be both cheaper and clearer if the vault grows large.
- `filteredSnippets()` / `allTags()` in `store.ts` are plain unmemoized
  getters. *Low-to-Medium impact* on their own, but combined with the
  whole-store subscriptions above they run more often than the data actually
  changes.
- The debounced autosave in `SnippetDetail.tsx` (500ms debounce, flushed on
  Ctrl+S) is implemented well — no issue there.

## Bundle size

- The production build emits a **~1.02 MB main JS chunk** (Vite warns about
  this). Main contributors: all eight `@codemirror/lang-*` packages are
  statically imported in `CodeEditor.tsx` regardless of which language is
  active, and `cmdk` (the command palette) is eagerly bundled even though it's
  only needed after the user opens the palette. *Medium impact* on cold-start
  time only (not steady-state UX) — lazily loading the CodeMirror language
  extension for the *currently selected* language on demand, and code-splitting
  `CommandPalette` behind a dynamic `import()`, are both low-risk wins.

## IPC boundary

No problems found here — this area is already handled well:
- `updateTags` re-fetches only the single affected snippet, not the whole list.
- `App.tsx` fires `loadSnippets()` and `loadFolders()` without awaiting between
  them, so they already run concurrently.
- No command refetches the entire snippet list after a single-row mutation;
  every CRUD path returns just the affected row and the store patches its
  local array in place.

## Suggested priority

If addressing any of this, the two changes with the best effort-to-payoff
ratio are: memoizing `CodeEditor`'s `extensions` array, and switching
`SnippetList`/`Sidebar` to narrower store selectors. Both directly reduce work
done on every keystroke, which is the app's hottest path. Everything else here
is safe to leave alone until the vault size or usage pattern actually demands it.
