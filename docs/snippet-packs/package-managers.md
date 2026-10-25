# Package Manager Snippet Pack

Common commands for **uv** (Python), **npm** (Node.js), and **winget** (Windows).
Import this file in CodeVault with **Import Markdown**. Every snippet is tagged
`package-manager` plus its tool name (`uv`, `npm`, or `winget`), so you can
filter by the whole pack or one tool at a time.

> winget snippets use `bash` as the language because CodeVault has no
> PowerShell language yet; the commands run as-is in PowerShell or cmd.

---

---
title: uv - Install uv
language: bash
tags: package-manager, uv, python, setup
---
```bash
# Linux / macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or via winget
winget install --id astral-sh.uv -e

# Update uv itself later
uv self update
uv --version
```

---

---
title: uv - Start a new project
language: bash
tags: package-manager, uv, python, setup
---
```bash
uv init my-app            # app project (pyproject.toml, main.py, .python-version)
uv init --lib my-lib      # library project with src/ layout
uv init --package my-cli  # installable package with an entry point
cd my-app
uv run main.py            # creates .venv and runs the script
```

---

---
title: uv - Add and remove dependencies
language: bash
tags: package-manager, uv, python, dependencies
---
```bash
uv add requests                 # runtime dependency
uv add "fastapi>=0.110"         # with a version constraint
uv add --dev pytest ruff        # dev-only dependencies
uv add --optional cli typer     # optional extra named "cli"
uv remove requests

uv tree                         # show the dependency tree
uv tree --outdated              # show which packages have newer versions
```

---

---
title: uv - Sync, lock, and upgrade
language: bash
tags: package-manager, uv, python, dependencies
---
```bash
uv sync                          # install exactly what uv.lock says
uv sync --frozen                 # fail instead of updating uv.lock (CI)
uv sync --no-dev                 # skip dev dependencies (prod)
uv lock                          # refresh uv.lock without installing
uv lock --upgrade                # upgrade everything within constraints
uv lock --upgrade-package httpx  # upgrade a single package
```

---

---
title: uv - Run commands in the project env
language: bash
tags: package-manager, uv, python
---
```bash
uv run python                    # REPL inside the project .venv
uv run pytest -q                 # run a tool installed as a dependency
uv run --with rich script.py     # add a one-off package for this run only
uvx ruff check .                 # run a tool without installing it (= uv tool run)
```

---

---
title: uv - Manage Python versions
language: bash
tags: package-manager, uv, python
---
```bash
uv python list                # available + installed interpreters
uv python install 3.12        # download a managed Python
uv python pin 3.12            # write .python-version for this project
uv venv --python 3.11         # create .venv with a specific version
```

---

---
title: uv - Install global CLI tools
language: bash
tags: package-manager, uv, python, tools
---
```bash
uv tool install ruff          # install a CLI tool into its own isolated env
uv tool install httpie
uv tool list                  # show installed tools
uv tool upgrade --all         # upgrade every tool
uv tool uninstall httpie
```

---

---
title: uv - Single-file script with inline dependencies
language: bash
tags: package-manager, uv, python, scripts
---
```bash
# Add a PEP 723 dependency block to the top of a script
uv init --script fetch.py --python 3.12
uv add --script fetch.py requests

# Run it; uv builds a throwaway env with those deps
uv run fetch.py
```

---

---
title: uv - pip-compatible commands and export
language: bash
tags: package-manager, uv, python, pip
---
```bash
uv venv                                   # create .venv
uv pip install -r requirements.txt        # drop-in replacement for pip
uv pip list
uv pip freeze > requirements.txt

# Convert a uv project to requirements.txt (for tools that need it)
uv export --format requirements-txt > requirements.txt

# Clear the global cache if disk is tight
uv cache clean
```

---

---
title: npm - Start a project and install packages
language: bash
tags: package-manager, npm, node, javascript, dependencies
---
```bash
npm init -y                     # create package.json with defaults
npm install express             # runtime dependency (alias: npm i)
npm install -D typescript vite  # dev dependency
npm install lodash@4.17.21      # exact version
npm install -g npm@latest       # global install (here: update npm itself)
npm uninstall express
```

---

---
title: npm - Clean install for CI
language: bash
tags: package-manager, npm, node, ci
---
```bash
# Installs exactly what package-lock.json says; deletes node_modules first.
# Fails if package.json and the lockfile disagree.
npm ci

# Production-only install
npm ci --omit=dev
```

---

---
title: npm - Run scripts
language: bash
tags: package-manager, npm, node
---
```bash
npm run                 # list scripts defined in package.json
npm run dev
npm run build
npm test                # shorthand for "npm run test"
npm start               # shorthand for "npm run start"
npm run lint -- --fix   # pass extra args after --
```

---

---
title: npm - Check for outdated and update
language: bash
tags: package-manager, npm, node, dependencies
---
```bash
npm outdated            # current vs wanted vs latest
npm update              # update within the semver ranges in package.json
npm install react@latest  # jump to a new major version

# Bump every range to latest (major upgrades included) — review the diff!
npx npm-check-updates -u && npm install
```

---

---
title: npm - Inspect installed packages
language: bash
tags: package-manager, npm, node, troubleshooting
---
```bash
npm ls                  # top-level dependency tree
npm ls react            # why/where is react installed?
npm ls -g --depth=0     # global packages
npm view react version  # latest published version
npm view react versions --json  # every published version
npm explain lodash      # which dependency pulls this in
```

---

---
title: npm - Security audit
language: bash
tags: package-manager, npm, node, security
---
```bash
npm audit                 # report known vulnerabilities
npm audit --omit=dev      # only production dependencies
npm audit fix             # apply non-breaking fixes
npm audit fix --force     # also apply breaking (major) fixes — test afterwards
```

---

---
title: npm - Run a package without installing (npx)
language: bash
tags: package-manager, npm, node, tools
---
```bash
npx create-vite@latest my-app   # scaffold a project
npx serve dist                  # quick static file server
npx tsc --init                  # run a local or remote binary
npm exec -- prettier --write .  # npm exec is the modern npx
```

---

---
title: npm - Fix a broken node_modules
language: bash
tags: package-manager, npm, node, troubleshooting
---
```bash
rm -rf node_modules package-lock.json
npm cache verify          # or: npm cache clean --force
npm install

# PowerShell equivalent of the first line:
# Remove-Item -Recurse -Force node_modules, package-lock.json
```

---

---
title: npm - Config and registry
language: bash
tags: package-manager, npm, node, config
---
```bash
npm config list                     # effective config
npm config get registry
npm config set init-author-name "Your Name"
npm config set save-exact true      # save exact versions instead of ^ranges
npm login                           # authenticate to the registry
npm whoami
```

---

---
title: npm - Bump version and publish
language: bash
tags: package-manager, npm, node, release
---
```bash
npm version patch       # 1.2.3 -> 1.2.4, also creates a git commit + tag
npm version minor       # 1.2.3 -> 1.3.0
npm version major       # 1.2.3 -> 2.0.0
npm pack --dry-run      # preview what files would be published
npm publish --access public
```

---

---
title: winget - Search and inspect packages
language: bash
tags: package-manager, winget, windows, powershell
---
```bash
winget search vscode                  # search by name/keyword
winget search --id Microsoft.PowerToys
winget show Microsoft.VisualStudioCode   # details, publisher, installer URL
winget show --id Git.Git --versions      # every available version
```

---

---
title: winget - Install packages
language: bash
tags: package-manager, winget, windows, powershell
---
```bash
# -e = exact ID match, avoids installing the wrong package
winget install --id Git.Git -e
winget install --id Microsoft.PowerShell -e
winget install --id Python.Python.3.12 -e --version 3.12.4

# Unattended install (no prompts, accept agreements) for scripts
winget install --id 7zip.7zip -e --silent --accept-package-agreements --accept-source-agreements

# Per-machine install (needs an elevated terminal)
winget install --id Mozilla.Firefox -e --scope machine
```

---

---
title: winget - Upgrade installed apps
language: bash
tags: package-manager, winget, windows, powershell, maintenance
---
```bash
winget upgrade                        # list apps with updates available
winget upgrade --id Git.Git -e        # upgrade one app
winget upgrade --all --silent --accept-package-agreements --accept-source-agreements
winget upgrade --all --include-unknown   # also apps whose version winget can't detect
```

---

---
title: winget - List and uninstall
language: bash
tags: package-manager, winget, windows, powershell
---
```bash
winget list                       # everything installed (winget or not)
winget list --name chrome         # filter by name
winget list --upgrade-available
winget uninstall --id Google.Chrome -e
```

---

---
title: winget - Pin a package version
language: bash
tags: package-manager, winget, windows, powershell, maintenance
---
```bash
# Stop "upgrade --all" from touching a package
winget pin add --id Microsoft.DotNet.SDK.8 -e
winget pin add --id Python.Python.3.12 -e --version 3.12.*
winget pin list
winget pin remove --id Microsoft.DotNet.SDK.8 -e
```

---

---
title: winget - Export and import an app list
language: bash
tags: package-manager, winget, windows, powershell, backup
---
```bash
# Back up the list of installed apps to JSON
winget export -o "$env:USERPROFILE\winget-apps.json" --include-versions

# Restore them on a new PC
winget import -i "$env:USERPROFILE\winget-apps.json" --accept-package-agreements --accept-source-agreements --ignore-unavailable
```

---

---
title: winget - Sources and troubleshooting
language: bash
tags: package-manager, winget, windows, powershell, troubleshooting
---
```bash
winget --info              # version, log location, settings path
winget source list         # configured sources (winget, msstore)
winget source update       # refresh package catalogs
winget source reset --force   # repair a corrupted source (elevated)
winget settings            # open settings.json in your editor
```

---

---
title: winget - New PC bootstrap script
language: bash
tags: package-manager, winget, windows, powershell, setup, scripts
---
```bash
# Save as setup.ps1 and run in an elevated PowerShell window
$apps = @(
  "Git.Git",
  "Microsoft.PowerShell",
  "Microsoft.WindowsTerminal",
  "Microsoft.VisualStudioCode",
  "astral-sh.uv",
  "OpenJS.NodeJS.LTS",
  "7zip.7zip"
)
foreach ($id in $apps) {
  winget install --id $id -e --silent --accept-package-agreements --accept-source-agreements
}
```
