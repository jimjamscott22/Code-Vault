# CodeVault — Implementation Plan

A phased, incremental build plan. Each phase ends with a runnable, demoable state.

## Prerequisites

- Rust toolchain (`rustup`, stable) + `cargo`.
- Node.js LTS + `pnpm` (or `npm`).
- Tauri prerequisites for Linux: `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libxdo-dev`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`.
- Verify: `cargo --version`, `node --version`, `pnpm --version`.

---

## Phase 1 — Tauri Skeleton

**Goal:** App launches, shows "Hello CodeVault".

1. Scaffold: `pnpm create tauri-app` → choose React + TypeScript + Vite + pnpm.
2. Rename app to `codevault`; set bundle identifier `dev.codevault.app`.
3. Add Tailwind:
   - `pnpm add -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init -p`
   - Configure `tailwind.config.js` content globs; import directives in `src/index.css`.
4. Run `pnpm tauri dev`; confirm window opens.
5. Commit: `chore: scaffold tauri + react + tailwind`.

**Exit criteria:** `pnpm tauri dev` opens a window rendering a Tailwind-styled component.

---

## Phase 2 — Static UI Mockup

**Goal:** Full three-pane layout rendered with hardcoded snippets.

1. Create components:
   - `src/components/Sidebar.tsx` — search input, collection list, snippet list.
   - `src/components/SnippetList.tsx` — list rows.
   - `src/components/SnippetDetail.tsx` — header + code area + notes.
   - `src/components/Layout.tsx` — three-pane CSS grid.
2. Seed `src/lib/mockData.ts` with 8–10 fake snippets.
3. Wire client-side state with `zustand` (or React context) for selected snippet.
4. Apply dark theme; set monospace accents (`font-mono` on code, headings).
5. Add language badge + tag chips (visual only).

**Exit criteria:** Clicking a snippet in the list updates the detail pane. No persistence yet.

---

## Phase 3 — SQLite Storage

**Goal:** CRUD against a real local DB.

1. Rust dependencies (`src-tauri/Cargo.toml`):
   - `rusqlite = { version = "0.31", features = ["bundled"] }`
   - `serde`, `serde_json`, `anyhow`, `thiserror`, `directories` (for data dir).
2. Create `src-tauri/src/db.rs`:
   - `init_db()` — opens DB at app data dir, runs migrations.
   - Migrations: versioned SQL strings; track in a `schema_version` table.
   - Apply schema from SPEC §6 (snippets, tags, snippet_tags).
3. Implement repository functions: `list_snippets`, `get_snippet`, `create_snippet`, `update_snippet`, `delete_snippet`, `list_tags`, `set_snippet_tags`.
4. Expose Tauri commands in `src-tauri/src/main.rs` via `#[tauri::command]` and register with `.invoke_handler`.
5. Frontend: `src/lib/api.ts` wrapping `@tauri-apps/api/core` `invoke()` calls; typed Snippet interfaces matching Rust structs.
6. Replace mock data with real API calls; add a "New Snippet" button.
7. Add delete confirmation modal.

**Exit criteria:** Create, edit, delete snippets; data persists across app restarts.

---

## Phase 4 — Code Editor

**Goal:** Real syntax-highlighted editing.

1. Install CodeMirror:
   - `pnpm add @uiw/react-codemirror @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-rust @codemirror/lang-html @codemirror/lang-css @codemirror/lang-markdown @codemirror/lang-sql @codemirror/lang-yaml`
   - `pnpm add @codemirror/theme-one-dark` (or pick a theme).
2. Build `src/components/CodeEditor.tsx`:
   - Props: `value`, `onChange`, `language`.
   - Language map: string → CodeMirror extension.
   - Dark theme matching app.
3. Wire to detail pane; debounced autosave (500 ms) calling `update_snippet`.
4. Add language selector dropdown that switches highlighter.
5. Add "Copy code" button using `@tauri-apps/plugin-clipboard-manager` (`pnpm add @tauri-apps/plugin-clipboard-manager`; register plugin in Rust).
6. Notes pane: second CodeMirror instance with `markdown` mode (or `react-markdown` for preview toggle).

**Exit criteria:** Editing feels like a real editor; copy button puts code in clipboard.

---

## Phase 5 — Search & Tags

**Goal:** Find snippets fast.

1. Basic search: backend SQL `LIKE` over title, code, notes; bind tag join for tag filter.
2. Frontend search input with 150 ms debounce → calls `search(query)`.
3. Tag management UI in detail header: chip input that calls `set_snippet_tags`.
4. Tag filter list in sidebar (click a tag → filter list).
5. Language filter dropdown in sidebar.
6. **FTS5 upgrade** (optional within Phase 5):
   - Add `snippets_fts` virtual table + triggers to keep in sync.
   - Switch `search()` to FTS5 `MATCH` query with rank ordering.
7. Add `Ctrl+F` to focus search input.

**Exit criteria:** Sub-100 ms search on a few hundred snippets; tag and language filters work.

---

## Phase 6 — Polish

**Goal:** Feels like a real product.

1. **Keyboard shortcuts** via `react-hotkeys-hook` or custom listener:
   - `Ctrl+N` new, `Ctrl+K` palette, `Ctrl+S` save, `Ctrl+/` toggle notes, `Ctrl+D` favorite.
2. **Command palette** (`cmdk` library): search + jump-to + actions.
3. **Import/export**:
   - JSON full-vault export (Tauri `dialog::save`).
   - JSON import with conflict resolution (skip / overwrite / rename).
   - Markdown import: parse front-matter for title/tags/language.
4. **Settings page**: theme toggle, default language, DB location display, "Open data folder" button.
5. **Backups**: on each launch, copy `vault.db` to `vault.db.bak-<date>`; keep last 7.
6. **Linux launcher**: provide `.desktop` file; bundle icon. Tauri bundles `.deb` and `.AppImage` via `pnpm tauri build`.
7. **CLI companion**:
   - New crate `codevault-cli` in workspace; shares `db` module with `src-tauri` (refactor `db.rs` into a `codevault-core` library crate).
   - Commands: `add`, `list`, `search`, `copy`, `import`, `export`.
   - File-lock or WAL coordination so CLI and GUI can both touch the DB.
8. **Empty states, loading states, error toasts.**

**Exit criteria:** Installable `.deb` / `.AppImage`; CLI works; shortcuts feel snappy.

---

## Phase 7 — Future / Optional

- Global hotkey (system-wide) for quick-add (Tauri `global-shortcut` plugin).
- Snippet version history (`snippet_versions` table + diff viewer).
- Collections UI.
- Git-backed vault: `codevault sync` that commits + pushes a Markdown export to a configured repo.
- Tailscale sync of `vault.db` between machines (file-level sync; document conflict caveats).
- AI tag suggestions via local Ollama (`reqwest` to `http://localhost:11434`).

---

## Repo Layout (Target)

```
Code-Vault/
├── SPEC.md
├── IMPLEMENTATION_PLAN.md
├── README.md
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tailwind.config.js
├── index.html
├── src/                       # React frontend
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   ├── lib/
│   │   ├── api.ts
│   │   └── types.ts
│   └── styles/
├── src-tauri/                 # Tauri shell
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       ├── main.rs
│       └── commands.rs
├── crates/                    # Phase 6
│   ├── codevault-core/        # shared DB + models
│   └── codevault-cli/
└── tests/
```

## Testing Strategy

- **Rust unit tests**: per-repository function, in-memory SQLite (`:memory:`).
- **Rust integration tests**: full migration + CRUD path against a temp file DB.
- **Frontend**: Vitest for `lib/`; React Testing Library for components.
- **E2E** (Phase 6+): Tauri's WebDriver via `tauri-driver` for smoke tests.

## Definition of Done (MVP = end of Phase 5)

- Create, edit, delete, search, tag, and copy snippets.
- Data persists at the platform-appropriate location.
- Dark theme, three-pane layout, syntax highlighting.
- Builds to a runnable `.AppImage` on Linux.
