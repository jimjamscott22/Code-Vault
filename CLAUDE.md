# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Note: there is an unrelated generic-Python `CLAUDE.md` in the home directory (`~/CLAUDE.md`). It does **not** apply here. CodeVault is a Tauri + React + TypeScript desktop app with a Rust/SQLite backend. Ignore the Python toolchain instructions.

## Project Overview

CodeVault is a local-first desktop snippet manager — a native app for storing reusable code, shell one-liners, configs, and commands with syntax highlighting, tags, and markdown notes. No accounts, no cloud; everything lives in a local SQLite database. The build is phased; see `docs/IMPLEMENTATION_PLAN.md` and the roadmap in `README.md` for status.

## Commands

All frontend commands use `pnpm` (a `pnpm-lock.yaml` is committed — do not introduce `npm`/`yarn`).

- `pnpm install` — install frontend deps
- `pnpm tauri dev` — run the full desktop app in dev (starts Vite on port 1420, then the Tauri shell). This is the primary way to run the app — `pnpm dev` alone only serves the frontend, which will fail on any `invoke()` call since the Rust backend isn't running.
- `pnpm tauri build` — production build; produces `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`
- `pnpm build` — type-check (`tsc`) + Vite build of the frontend only
- Rust backend: `cargo build` / `cargo check` / `cargo clippy` from inside `src-tauri/`

There is no test suite or linter configured yet (no vitest/eslint/jest). `pnpm build` (which runs `tsc`) is the closest thing to a frontend check; use `cargo check`/`cargo clippy` for the Rust side.

### Linux system dependencies

Tauri needs system libraries to build (`pnpm install` alone is not enough):

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

## Architecture

The app is two halves bridged by Tauri's IPC. Understanding this boundary is the key to working here.

**Frontend (`src/`)** — React 19 + TypeScript + Vite, styled with Tailwind, editor via CodeMirror 6.
**Backend (`src-tauri/src/`)** — Rust, SQLite via `rusqlite` (bundled).

### The data flow (single source of truth → UI)

```
SQLite (vault.db)
  └─ src-tauri/src/db.rs        repository fns + schema/migrations; owns the Snippet struct
  └─ src-tauri/src/commands.rs  thin #[tauri::command] wrappers; lock the Mutex, map errors to String
  └─ src-tauri/src/lib.rs       registers DbState + invoke_handler (every new command must be listed here)
        ↕ Tauri IPC (invoke)
  └─ src/lib/api.ts             typed invoke() wrappers — one fn per Rust command, the ONLY IPC layer
  └─ src/lib/store.ts           Zustand store — app state, calls api.*, holds snippets[] in memory
  └─ src/components/*           render from the store; mutations go back through the store
```

Key conventions and gotchas when extending:

- **Adding a backend command requires four coordinated edits**: implement in `db.rs`, wrap in `commands.rs`, register in the `invoke_handler!` macro in `lib.rs`, and add a typed wrapper in `src/lib/api.ts`. Missing the `lib.rs` registration is the most common mistake — the command will fail at runtime, not compile time.
- **Argument name casing across the IPC boundary**: Tauri auto-converts. JS passes camelCase keys (e.g. `tagNames`) and the Rust command receives snake_case params (`tag_names`). The invoke object keys in `api.ts` must match what Tauri expects — see `setSnippetTags` for the pattern.
- **The DB connection is a single `Mutex<Connection>`** held in `DbState` (`commands.rs`) and managed by Tauri. Every command locks it. There is no connection pool; keep handlers short.
- **`Snippet` is denormalized on read**: tags live in `tags`/`snippet_tags` join tables but are flattened into a `Vec<String>` via `GROUP_CONCAT` in the shared `SNIPPET_SELECT` constant (`db.rs`). Reuse `SNIPPET_SELECT` for any query returning snippets so the shape stays consistent with `row_to_snippet`.
- **Schema changes go through `migrate()` in `db.rs`**: append a `(version, sql)` tuple to the `migrations` array; never edit an existing migration. Version is tracked in the `schema_version` table.
- **Two filtering paths exist**: `store.ts`'s `filteredSnippets()` filters the in-memory list client-side (used by the live UI), while `db.rs`'s `search_snippets` does a SQL `LIKE` search. The UI currently relies on client-side filtering; keep them behaviorally aligned if you touch either.
- **Timestamps are Unix seconds (`i64`)**, set server-side via `now()` in `db.rs`. The frontend treats them as numbers.

### CodeMirror language support

`src/components/CodeEditor.tsx` maps a snippet's `language` string to a CodeMirror extension via `LANG_MAP`. To support a new language: install its `@codemirror/lang-*` package and add an entry. Languages with no grammar (`bash`, `nginx`, `toml`) map to `() => []` (plain text, no highlighting) — that's intentional, not a bug.

## Data location

The SQLite DB is created at the OS app-data dir (resolved by `init_db` in `db.rs`):
- Linux: `~/.local/share/codevault/vault.db` (actual path derives from the `dev.codevault.app` identifier in `tauri.conf.json`)
- macOS: `~/Library/Application Support/codevault/vault.db`
- Windows: `%APPDATA%\codevault\vault.db`

When debugging storage, that file is the ground truth; deleting it resets the app to an empty vault (migrations re-run on next launch).
