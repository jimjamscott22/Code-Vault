# CodeVault

A local-first desktop snippet manager — your personal terminal memory trap for reusable code, shell one-liners, configs, and commands.

No accounts. No cloud. No browser tab. Just a fast native app backed by SQLite.

## What it is

CodeVault stores code snippets with syntax highlighting, tags, and markdown notes in a local SQLite database. It runs as a native desktop app (Tauri + React) with a companion CLI for terminal-driven capture.

```text
┌──────────────────────┬──────────────────────────────────────────┐
│ Search               │ Snippet Title                            │
│                      │ Tags: docker, caddy, https               │
│ Collections          │ Language: Caddyfile                      │
│  - Linux             │                                          │
│  - Docker            │ ┌──────────────────────────────────────┐ │
│  - Java              │ │ code editor (CodeMirror)             │ │
│  - Tailscale         │ │                                      │ │
│                      │ └──────────────────────────────────────┘ │
│ Snippet List         │ Notes / Markdown                         │
└──────────────────────┴──────────────────────────────────────────┘
```

## Stack

| Layer | Choice |
| --- | --- |
| Desktop shell | Tauri (Rust) |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Editor | CodeMirror 6 |
| Database | SQLite (via `rusqlite`) |
| CLI | Rust binary, shared DB |

## Getting started

### Prerequisites

- Rust toolchain: `rustup` + stable channel
- Node.js LTS + `pnpm`
- Linux system deps:

```bash
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

### Run in development

```bash
pnpm install
pnpm tauri dev
```

### Build

```bash
pnpm tauri build
```

Produces a `.deb` and `.AppImage` in `src-tauri/target/release/bundle/`.

## Data location

- Linux: `~/.local/share/codevault/vault.db`
- Windows: `%APPDATA%\codevault\vault.db`
- macOS: `~/Library/Application Support/codevault/vault.db`

## CLI companion (Phase 6)

```bash
codevault add --title "Restart Pi-hole" --lang bash
history | tail -20 | codevault import
codevault search nginx
codevault copy <id>
```

## Roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| 1 | Tauri skeleton — app launches | in progress |
| 2 | Static UI — three-pane layout with mock data | planned |
| 3 | SQLite storage — real CRUD | planned |
| 4 | CodeMirror editor — syntax highlighting | planned |
| 5 | Search & tags — filter and find fast | planned |
| 6 | Polish — shortcuts, CLI, import/export, `.deb` | planned |

## License

MIT
