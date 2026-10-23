# Clearer snippet cards and flexible organization

Status: Implemented (see `docs/CARD_VIEW_SPEC.md` for the resulting behavior).

## Summary

Make Code Vault easier to scan and compare through richer cards, predictable grouping, and a detail pane that keeps your browsing context visible.

Use **folders as each snippet's primary home**, **tags for overlapping topics**, and **language as a separate filter and grouping option**. Preserve the app's existing colors, typography, editor, and desktop conventions.

## Display and browsing

- Give every card the same structure:
  1. Title, limited to two lines, with a clear favorite indicator.
  2. Short description, limited to two lines.
  3. Code preview with preserved indentation and approximately six visible lines.
  4. Language badge, folder name, and up to three tags, followed by a remaining-tag count.
- Use aligned card heights and reserved description space so code previews line up. Show "No description" and "Empty snippet" when appropriate.
- Retain language colors as accents and use the existing theme tokens for readable text and selection states.
- Keep previews lightweight by capping displayed code before rendering; show full content in the detail editor.
- In card mode, keep search and organizational filters in the sidebar and hide the duplicate sidebar snippet list.

## Organization and controls

- Add a card-view toolbar with result count, **Group by: None / Folder / Language**, **Sort: Title / Recently updated**, and a clear-filters action.
- Default new browsing preferences to **no grouping** and **title A–Z**. Persist grouping and sorting through the existing local settings store; preserve the user's saved view mode.
- Apply search and filters first, then grouping and sorting. Each snippet appears exactly once in the card results.
- Order folder and language groups alphabetically, with **Unfiled** last. Show counts and omit empty groups.
- Include descriptions in text search so the new card summaries are searchable.
- Keep tag categories and their stored assignments available. Replace category sections in the card view with the explicit grouping control; retain existing list, table, and board organization in this iteration.

## Opening and editing

- Opening a card keeps card mode active and opens the existing snippet editor beside the grid.
- At window widths of at least 1280px, show a resizable detail pane, initially 480px wide. Keep at least 480px for the grid and 360px for the editor.
- On smaller windows, show the detail editor in the main area with a **Back to snippets** action.
- Closing the pane or returning to browsing restores filters, grouping, sorting, and grid scroll position.
- Reuse existing autosave, template filling, copy, favorite, and delete behavior. Keep an opened snippet visible if editing makes it stop matching the current filters; deleting it closes its detail pane.
- Provide labeled controls, visible keyboard focus, keyboard card activation, and keyboard resizing.

## Implementation and verification

- Extend frontend settings with typed card grouping and sorting preferences, validating saved values and supplying defaults for older settings.
- Derive card groups from the existing filtered snippet collection. Manage the card/detail layout separately from the saved view mode.
- Reuse existing snippet fields and editor components. No SQLite migration, CLI changes, or import/export changes are required.
- Verify grouping, stable sorting, combined filters, missing metadata, and snippets with tags in multiple categories.
- Verify opening, editing, closing, deletion, scroll restoration, resizing, and switching between wide and narrow layouts.
- Check both themes, long titles and code lines, empty results, keyboard operation, and existing view switching.
- Run `pnpm build`; verify rendered interactions in a browser and native persistence through Tauri where available, reporting those results separately.
- Update the card-view documentation to describe the new behavior and create a focused local commit after verification.

This iteration changes presentation and browsing behavior; existing snippet content and folder/tag assignments stay intact.
