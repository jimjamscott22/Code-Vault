# CodeVault — Spec Sheet

## 1. Overview

**CodeVault** is a local-first desktop snippet manager. It stores code snippets, notes, and tags in a local SQLite database and runs as a native Tauri app with a React/TypeScript frontend. No accounts, no cloud, no server — a personal "terminal memory trap" for reusable code, configs, and commands.

## 2. Goals & Non-Goals

### Goals
- Native-feeling desktop app on Linux (Ubuntu primary), portable to Windows/macOS.
- Local-first: all data stored on disk, works fully offline.
- Fast launch, fast search, fast copy-to-clipboard.
- Rich code editing with syntax highlighting.
- Companion CLI for terminal-driven capture.

### Non-Goals (MVP)
- Multi-user accounts, teams, sharing.
- Cloud sync (deferred — optional Tailscale sync later).
- Mobile clients.
- Real-time collaboration.

## 3. Target User

A single developer (Linux power user) who wants a personal vault for code snippets, shell one-liners, configs, and notes — accessible without a browser tab or cloud login.

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Desktop shell | Tauri (Rust) |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS (+ optional shadcn/ui) |
| Editor | CodeMirror 6 (preferred) or Monaco |
| Native/Backend | Rust (Tauri commands) |
| Database | SQLite (via `rusqlite` or `sqlx`) |
| Search (MVP) | SQL `LIKE` queries |
| Search (later) | SQLite FTS5 + fuzzy ranking |
| CLI companion | Rust binary sharing the same DB |

## 5. Functional Requirements

### 5.1 Snippets (MVP)
- Create snippet with: title, description, language, code, notes (markdown), tags, favorite flag.
- View snippet in a detail pane with syntax-highlighted code + rendered notes.
- Edit snippet inline; autosave on blur (or explicit Save).
- Delete snippet (with confirmation).
- Copy code to clipboard via a single button or keyboard shortcut.
- Toggle favorite.

### 5.2 Browsing & Search
- Sidebar list of snippets (title + language badge + tags).
- Search bar filters by title, code body, and tags.
- Filter by tag and by language.
- Sort by recently updated (default), created, alphabetical.

### 5.3 Tags & Collections
- Tags are free-form, many-to-many with snippets.
- Tag chips in the detail view; click to filter.
- Collections (Phase 6+): user-defined groupings (e.g., "Linux", "Docker").

### 5.4 Import / Export
- Import: Markdown files, JSON dump.
- Export: full vault to JSON; per-snippet to `.md` or raw code file.
- Export vault as a Git repo (Phase 6).

### 5.5 CLI Companion (Phase 6)
- `codevault add --title "..." --lang bash` — opens `$EDITOR` for body.
- `codevault add --title "..." --lang bash --file path.sh`
- `history | tail -20 | codevault import` — pipe stdin.
- `codevault list`, `codevault search <query>`, `codevault copy <id>`.
- Reads/writes the same SQLite DB as the desktop app.

### 5.6 Keyboard / Power-User
- `Ctrl+K` command palette (search + actions).
- `Ctrl+N` new snippet.
- `Ctrl+C` (in detail view) copy code.
- Global hotkey to open quick-add (Phase 6).

## 6. Data Model

### Tables (MVP)

```
snippets
- id           INTEGER PRIMARY KEY
- title        TEXT NOT NULL
- description  TEXT
- language     TEXT
- code         TEXT NOT NULL
- notes        TEXT          -- markdown
- favorite     INTEGER DEFAULT 0
- created_at   INTEGER       -- unix epoch
- updated_at   INTEGER

tags
- id           INTEGER PRIMARY KEY
- name         TEXT UNIQUE NOT NULL

snippet_tags
- snippet_id   INTEGER REFERENCES snippets(id) ON DELETE CASCADE
- tag_id       INTEGER REFERENCES tags(id) ON DELETE CASCADE
- PRIMARY KEY (snippet_id, tag_id)
```

### Tables (Later)

```
collections
- id, name, created_at

snippet_collections
- snippet_id, collection_id

snippet_versions          -- history / undo
- id, snippet_id, code, notes, created_at

snippets_fts              -- FTS5 virtual table mirroring title/code/notes
```

### Storage Location
- Linux: `$XDG_DATA_HOME/codevault/vault.db` (fallback `~/.local/share/codevault/vault.db`)
- Windows: `%APPDATA%\codevault\vault.db`
- macOS: `~/Library/Application Support/codevault/vault.db`

## 7. UI Layout

Three-pane layout:

```
┌──────────────┬──────────────────────────────────────────┐
│ Search       │ Snippet Title                            │
│              │ Tags: docker, caddy, https               │
│ Collections  │ Language: Caddyfile                      │
│  - Linux     │                                          │
│  - Docker    │ ┌──────────────────────────────────────┐ │
│  - Java      │ │ code editor (CodeMirror)             │ │
│  - Tailscale │ │                                      │ │
│              │ └──────────────────────────────────────┘ │
│ Snippet List │ Notes / Markdown                         │
└──────────────┴──────────────────────────────────────────┘
```

- **Left rail**: search input, collection/tag filters, snippet list.
- **Right pane**: snippet metadata header, code editor, notes panel.
- Dark theme default; "terminal-adjacent" aesthetic (monospace accents, muted palette).

## 8. Tauri Command Surface

Rust commands exposed to the frontend:

- `list_snippets(filter: Filter) -> Vec<SnippetSummary>`
- `get_snippet(id: i64) -> Snippet`
- `create_snippet(input: NewSnippet) -> Snippet`
- `update_snippet(id: i64, patch: SnippetPatch) -> Snippet`
- `delete_snippet(id: i64) -> ()`
- `toggle_favorite(id: i64) -> bool`
- `list_tags() -> Vec<Tag>`
- `set_snippet_tags(id: i64, tag_names: Vec<String>) -> ()`
- `search(query: String) -> Vec<SnippetSummary>`
- `copy_to_clipboard(text: String) -> ()` (or use `@tauri-apps/plugin-clipboard-manager`)
- `export_vault(path: String, format: ExportFormat) -> ()`
- `import_vault(path: String, format: ImportFormat) -> ImportReport`

## 9. Non-Functional Requirements

- **Startup time**: cold launch < 500 ms on modern hardware.
- **Search latency**: < 50 ms over 10k snippets (FTS5 phase).
- **Bundle size**: < 15 MB installer (Tauri target).
- **Data integrity**: SQLite WAL mode; transactional writes; daily auto-backup file (Phase 6).
- **Accessibility**: full keyboard navigation; screen-reader labels on actions.

## 10. Risks & Open Questions

- CodeMirror vs Monaco: CodeMirror is lighter and fits Tauri's minimalist ethos; Monaco gives VS Code parity but is heavier. **Recommendation: CodeMirror 6.**
- SQLite migrations strategy: use `refinery` or hand-rolled versioned scripts in Rust.
- Clipboard plugin permission scope in Tauri v2.
- AI tag suggestions (Ollama): out of MVP; revisit after Phase 6.

---
