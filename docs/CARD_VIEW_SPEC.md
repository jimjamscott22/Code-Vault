# Card View — Spec & Implementation Plan

## Brainstorm (options considered)

| Question | Options | Decision |
|---|---|---|
| Where does the view live? | New route/page · modal · replace the detail pane | **Replace the detail pane.** The sidebar (search, tags, languages, folders) keeps working as the filter panel, so no router is needed. |
| How to switch? | Sidebar button · shortcut · command palette | **Sidebar header grid/list toggle + `Ctrl/Cmd+G`.** |
| "First N characters that fit" | Fixed N · CSS line-clamp | **CSS `line-clamp`** on a monospace `pre-wrap` block, so the card shows exactly as much as fits. The code is also hard-capped at 400 chars before rendering so huge snippets don't bloat the DOM. |
| Making the label stand out | Plain title · language-colored title + accent stripe | **Large, bold, language-colored label** plus a colored stripe along the top of the card. Colors come from the existing `languageColors.ts` so nothing new has to be kept in sync. |
| Persist the chosen view? | Session only · localStorage | **localStorage** via `settings.ts`, because it's a UI preference and not vault data. |

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
