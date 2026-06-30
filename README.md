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
- Node.js 20+ and `pnpm`
- Linux build libraries (see [Debian build & install](#building-and-installing-on-debian) below)

### Run in development

```bash
pnpm install
pnpm tauri dev
```

This starts the Vite dev server and opens the Tauri window. Use this for day-to-day work — `pnpm dev` alone only serves the frontend and will fail on backend `invoke()` calls.

## Building and installing on Debian

These steps apply to **Debian 12 (Bookworm)**, **Ubuntu 22.04+**, and similar derivatives (Mint, Pop!\_OS, etc.). You need `libwebkit2gtk-4.1` — it is not available on Debian 11 / Ubuntu 20.04 without extra repos.

### 1. Install system packages

Build-time libraries for Tauri on Linux:

```bash
sudo apt update
sudo apt install -y \
  build-essential curl wget file pkg-config \
  libssl-dev libxdo-dev \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

After installing the `.deb`, the package manager pulls in runtime WebKit/GTK dependencies automatically. If you run the **AppImage** instead, you still need those libraries on the system (same packages, but the `-dev` suffix is optional at runtime — `apt install libwebkit2gtk-4.1-0 libayatana-appindicator3-1` is enough).

### 2. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup default stable
rustc --version   # sanity check
```

### 3. Install Node.js and pnpm

Node **20 or newer** is required (Vite 7). On Debian/Ubuntu, use [NodeSource](https://github.com/nodesource/distributions) or [fnm](https://github.com/Schniz/fnm); then:

```bash
corepack enable
corepack prepare pnpm@latest --activate
node --version    # should be v20+
pnpm --version
```

### 4. Clone, install deps, and build

```bash
git clone <repository-url>
cd Code-Vault

pnpm install
pnpm tauri build
```

The first build compiles the Rust backend and bundles the frontend; expect several minutes on a typical machine.

**Output artifacts** land under `target/release/bundle/` at the **repo root** (this project is a Cargo workspace, so build output is shared — not under `src-tauri/target/`). Version and arch in the filename may differ:

| Format | Path |
| --- | --- |
| `.deb` | `target/release/bundle/deb/CodeVault_*_amd64.deb` |
| AppImage | `target/release/bundle/appimage/CodeVault_*_amd64.AppImage` |

List what was produced:

```bash
ls target/release/bundle/deb/
ls target/release/bundle/appimage/
```

### 5. Install the `.deb` (recommended)

```bash
sudo apt install ./target/release/bundle/deb/CodeVault_*_amd64.deb
```

Using `apt install ./path/to/file.deb` (not plain `dpkg -i`) resolves missing dependencies in one step. If you already used `dpkg -i` and see unmet dependencies, run `sudo apt --fix-broken install`.

The package installs as **`code-vault`** on Debian (the launch command is still `codevault`):

- Binary: `/usr/bin/codevault`
- Desktop entry: `/usr/share/applications/CodeVault.desktop`
- Icons under `/usr/share/icons/hicolor/`

Launch from the app menu, or:

```bash
codevault
```

### 6. AppImage (portable, no root)

```bash
chmod +x target/release/bundle/appimage/CodeVault_*_amd64.AppImage
./target/release/bundle/appimage/CodeVault_*_amd64.AppImage
```

Optional — install for your user only:

```bash
mkdir -p ~/.local/bin
cp target/release/bundle/appimage/CodeVault_*_amd64.AppImage ~/.local/bin/codevault
chmod +x ~/.local/bin/codevault
```

For a launcher icon without the `.deb`, copy [`packaging/codevault.desktop`](packaging/codevault.desktop) to `~/.local/share/applications/` and the icon from `src-tauri/icons/128x128.png` to `~/.local/share/icons/codevault.png` (see comments in that file).

### 7. CLI companion (optional)

The terminal CLI is a **separate** Rust binary (not included in the `.deb`). Build from the repo root:

```bash
cargo build --release -p codevault-cli
```

Binary: `target/release/codevault`. It reads the same database as the desktop app (`~/.local/share/codevault/vault.db`).

**Name clash:** the desktop app and CLI binary are both called `codevault`. Do not copy the CLI to `/usr/bin` if the `.deb` is installed — put it on your user PATH instead:

```bash
mkdir -p ~/.local/bin
cp target/release/codevault ~/.local/bin/codevault-cli
# use: codevault-cli search nginx
```

Ensure `~/.local/bin` is on your `PATH`.

### Uninstall

```bash
sudo apt remove code-vault
```

Your snippets remain at `~/.local/share/codevault/vault.db` until you delete that directory.

### Troubleshooting

| Problem | What to try |
| --- | --- |
| `libwebkit2gtk-4.1-dev` not found | Upgrade to Debian 12 / Ubuntu 22.04+, or add a repo that ships WebKitGTK 4.1 |
| `pnpm tauri build` fails on frontend | Run `pnpm build` alone and fix TypeScript errors first |
| Blank window in dev | Confirm you ran `pnpm tauri dev`, not `pnpm dev` |
| AppImage won't start | Install runtime GTK/WebKit libs (see step 1) |
| `apt install ./…deb` dependency errors | Use `sudo apt --fix-broken install`, then retry |

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Cmd+N` | New snippet |
| `Ctrl/Cmd+K` | Command palette |
| `Ctrl/Cmd+F` | Focus search |
| `Ctrl/Cmd+S` | Save now (flush autosave) |
| `Ctrl/Cmd+D` | Toggle favourite |
| `Ctrl/Cmd+/` | Toggle notes pane |
| `Ctrl/Cmd+,` | Open settings |
| `Esc` | Close palette / settings |

## Import / export

Open **Settings** (gear icon, top-left, or `Ctrl+,`):

- **Export vault (JSON)** — writes the whole vault to a JSON file.
- **Import vault (JSON)** — merges a JSON export; on a title conflict choose *rename*, *skip*, or *overwrite*.
- **Import Markdown** — creates a snippet from a `.md` file; a `---` front-matter block supplies `title`, `language`, and comma-separated `tags`, and the body becomes the snippet code.

A dated backup of `vault.db` is taken on each launch (last 7 kept) in the data directory.

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
| 1 | Tauri skeleton — app launches | done |
| 2 | Static UI — three-pane layout with mock data | done |
| 3 | SQLite storage — real CRUD | done |
| 4 | CodeMirror editor — syntax highlighting | done |
| 5 | Search & tags — filter and find fast | done |
| 6 | Polish — shortcuts, CLI, import/export, `.deb` | in progress |

For a reusable visual roadmap format, see [`docs/PROJECT_TIMELINE_TEMPLATE.md`](docs/PROJECT_TIMELINE_TEMPLATE.md).

## License

MIT
