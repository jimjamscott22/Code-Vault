# Card View — Spec & Implementation Plan

## Brainstorm (options considered)

| Question | Options | Decision |
|---|---|---|
| Where does the view live? | New route/page · modal · replace the detail pane | **Replace the detail pane.** The sidebar (search, tags, languages, folders) keeps working as the filter panel, so no router is needed. |
| How to switch? | Sidebar button · shortcut · command palette | **Sidebar header grid/list toggle + `Ctrl/Cmd+G`.** |
| "First N characters that fit" | Fixed N · CSS line-clamp | **CSS `line-clamp`** on a monospace `pre-wrap` block, so the card shows exactly as much as fits. The code is also hard-capped at 400 chars before rendering so huge snippets don't bloat the DOM. |
| Making the label stand out | Plain title · language-colored title + accent stripe | **Large, bold, language-colored label** plus a colored stripe along the top of the card. Colors come from the existing `languageColors.ts` so nothing new has to be kept in sync. |
| Persist the chosen view? | Session only · localStorage | **localStorage** via `settings.ts`, because it's a UI preference and not vault data. |

## Current behavior

This supersedes the original spec below wherever they differ (see `docs/10-20-2026-snippet-display-and-organization-plan.md` for the rationale).

**Cards** share one structure, with fixed-height blocks so code previews line up across a row:
1. Title (2 lines, language-colored) with a star when favorited.
2. Description (2 lines), or a muted "No description".
3. Code preview: the first 6 lines (of at most 400 chars), indentation preserved, or a muted "Empty snippet".
4. Language badge, folder name ("Unfiled" when none), up to 3 tags, then a `+N` count.

**Toolbar** (top of the card view): result count (`N of M` while filtering), **Group by** None / Folder / Language, **Sort** Title (A–Z) / Recently updated, and **Clear filters**. Grouping and sorting persist in `settings.ts` (`cardGroupBy`, `cardSort`; defaults: none, title). Search, tag, language and folder filters stay in the sidebar, which hides its duplicate snippet list in card view. Search also matches descriptions.

**Grouping** is derived from the filtered list by `src/lib/cardGroups.ts`: filter, then sort (ties broken by id), then bucket. Each snippet appears once; groups are alphabetical with "Unfiled" last; empty groups are omitted. Tag categories are no longer used in card view (list view still groups by them).

**Opening a snippet** keeps card view active:
- Window ≥ 1280px: the editor opens in a pane beside the grid (initially 480px). Drag the divider, or focus it and use ←/→ (Shift for bigger steps, Home/End for the limits). The grid keeps at least 480px and the editor at least 360px.
- Narrower windows: the editor replaces the grid, with a **Back to snippets** button.
- Closing the pane restores filters, grouping, sorting, grid scroll position and focus on the card that was opened. The opened snippet stays in the pane even if edits make it stop matching the filters; deleting it closes the pane. Leaving card view also closes it.
- The pane is the regular editor (autosave, fill & copy, copy, favorite, delete). Pending edits are flushed when the pane closes or another card is opened.

State: the pane's open flag lives in `store.ts` (`cardDetailOpen`), separate from the saved `viewMode`; the pane width is component state.

## Original spec (initial version)

> Parts of this are superseded by "Current behavior" above: cards now show more than title and code, and clicking a card no longer switches to list view.

## Spec

- A new **card view** renders every snippet from `filteredSnippets()` in a responsive grid (`repeat(auto-fill, minmax(220px, 1fr))`).
- Each card shows **only**:
  1. the **label** (snippet title, clamped to 2 lines, colored by language), and
  2. a **code preview**, the first characters of `code` that fit in about 6 lines (clamped with an ellipsis). Empty code shows a muted `// empty`.
- The top stripe of each card uses the language color. A favorite gets a subtle emerald ring. No badges, tags, or dates.
- Clicking a card (or pressing Enter/Space when it has focus) selects the snippet and switches back to the list/detail view.
- The toggle button in the sidebar header switches between `list` and `cards`, and so does `Ctrl/Cmd+G`. The choice is persisted.
- Empty state: `no snippets found`, matching `SnippetList`.
- Theme: uses the existing `zinc-*` palette, so light mode works through the CSS-variable ramp.

## Implementation plan

1. `src/lib/settings.ts`: add `viewMode: "list" | "cards"` (default `"list"`), `setViewMode`, and `toggleViewMode`, and persist `viewMode`.
2. `src/components/SnippetCards.tsx` (new): a grid of `SnippetCard` components.
3. `src/components/Layout.tsx`: render `<SnippetCards/>` instead of `<SnippetDetail/>` when `viewMode === "cards"`.
4. `src/components/Sidebar.tsx`: add a grid/list toggle button in the header.
5. `src/components/Shortcuts.tsx`: add `Ctrl/Cmd+G`.
6. Verify with `pnpm build` (tsc and Vite).

No backend or IPC changes are needed.
