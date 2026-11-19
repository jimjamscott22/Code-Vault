# CodeVault Sample Snippets

This file contains 31 useful code snippets and scripts ready to import into CodeVault using the **Import Markdown** feature.

---

---
uid: 01a1f623-ac9e-72ca-a831-bc79bc8af850
title: Docker Cleanup and Prune
language: bash
tags: docker, cleanup, system
---
```bash
# Remove stopped containers
docker container prune -f

# Remove dangling images
docker image prune -f

# Remove unused volumes
docker volume prune -f

# Full cleanup (images, containers, volumes, networks)
docker system prune -a --volumes
```

---

---
uid: 01a1f623-ac9f-7213-a7e0-d8619c754562
title: Find Large Files in Directory
language: bash
tags: linux, disk-usage, files
---
```bash
# Find top 10 largest files recursively
find . -type f -exec ls -lh {} + | sort -k5 -hr | head -10

# Alternative using du
du -ah . | sort -rh | head -20

# Find files larger than 100MB
find . -type f -size +100M
```

---

---
uid: 01a1f623-aca0-7176-b23e-84710f4c3896
title: Backup Directory with Timestamp
language: bash
tags: backup, administration, tar
---
```bash
#!/bin/bash
# Backup a directory with date-based naming
DIR_TO_BACKUP="$1"
BACKUP_DIR="${HOME}/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/${DIR_TO_BACKUP##*/}_${TIMESTAMP}.tar.gz" "$DIR_TO_BACKUP"
echo "Backup complete: $BACKUP_DIR/${DIR_TO_BACKUP##*/}_${TIMESTAMP}.tar.gz"
```

---

---
uid: 01a1f623-aca1-7234-9706-e7f1eb5778cc
title: Check Open Ports
language: bash
tags: networking, ports, linux
---
```bash
# List all listening ports
sudo netstat -tulpn | grep LISTEN

# Alternative using ss (faster)
sudo ss -tulpn | grep LISTEN

# Find process listening on specific port
sudo lsof -i :8080

# Check if port is open without root
nc -zv localhost 3000
```

---

---
uid: 01a1f623-aca2-7e48-bec2-0243e37a85d5
title: Git Force Pull (Discard Local)
language: bash
tags: git, version-control
---
```bash
# Discard all local changes and pull latest
git fetch origin
git reset --hard origin/main

# Or for current branch
git fetch origin
git reset --hard origin/$(git rev-parse --abbrev-ref HEAD)
```

---

---
uid: 01a1f623-aca3-77b5-b637-865ab9a68a58
title: Extract and Convert Media Files
language: bash
tags: ffmpeg, media, conversion
---
```bash
# Convert MP4 to WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 output.webm

# Extract audio as MP3
ffmpeg -i video.mp4 -q:a 0 -map a audio.mp3

# Resize video to 720p
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# Create GIF from video (first 5 seconds)
ffmpeg -i input.mp4 -t 5 -vf "fps=10,scale=320:-1:flags=lanczos" output.gif
```

---

---
uid: 01a1f623-aca4-70ea-9075-19298b8a2867
title: Monitor System Resources
language: bash
tags: monitoring, system, performance
---
```bash
#!/bin/bash
# Continuous system resource monitor
watch -n 1 'echo "=== CPU ==="; top -bn1 | head -12; echo "=== Memory ==="; free -h; echo "=== Disk ==="; df -h /'
```

---

---
uid: 01a1f623-aca5-7ce3-b306-bd925a7f8a34
title: Generate Random Password
language: bash
tags: security, password, random
---
```bash
# Generate 32-character random password
openssl rand -base64 32

# Generate alphanumeric only (no special chars)
tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32; echo

# Using /dev/urandom (portable)
cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*' | fold -w 32 | head -1
```

---

---
uid: 01a1f623-aca6-704c-b710-76f474b8befd
title: Batch Rename Files
language: bash
tags: bash, file-operations, rename
---
```bash
# Rename all .txt files to .md
for file in *.txt; do mv "$file" "${file%.txt}.md"; done

# Add prefix to all PNG files
for file in *.png; do mv "$file" "thumb_${file}"; done

# Change extension (e.g., .jpeg to .jpg)
for file in *.jpeg; do mv "$file" "${file%.jpeg}.jpg"; done

# Using rename tool (if available)
rename 's/\.txt$/.md/' *.txt
```

---

---
uid: 01a1f623-aca7-7ae3-85a9-d72508c5b8ee
title: Search and Replace in Files
language: bash
tags: grep, sed, text-processing
---
```bash
# Simple grep search
grep -r "search_term" ./src

# Grep with context lines (before and after)
grep -B2 -A2 "pattern" file.txt

# Case-insensitive search
grep -ri "pattern" ./src

# Replace in all files (sed)
find . -name "*.js" -type f -exec sed -i 's/oldText/newText/g' {} +

# Safer backup version
find . -name "*.js" -type f -exec sed -i.bak 's/oldText/newText/g' {} +
```

---

---
uid: 01a1f623-aca8-7f31-9add-3832e346df6c
title: Kill Process by Name
language: bash
tags: process, kill, system
---
```bash
# Kill process by name
killall node

# Kill with signal (graceful)
killall -SIGTERM node

# Kill by port number
lsof -i :8080 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Kill all processes matching pattern
pkill -f "python.*script.py"
```

---

---
uid: 01a1f623-aca9-7611-915c-8eb09034fb1a
title: Simple HTTP Server
language: bash
tags: http, server, testing
---
```bash
# Python 3 (port 8000)
python3 -m http.server

# Python 3 (custom port)
python3 -m http.server 8080

# Python 2 (legacy)
python -m SimpleHTTPServer 8000

# Node.js (requires http-server)
npx http-server -p 8080

# Node.js one-liner with Express
node -e "require('http').createServer((req, res) => { res.writeHead(200); res.end('Hello'); }).listen(8080)"
```

---

---
uid: 01a1f623-acaa-7bfb-affa-45a914867077
title: Create Nginx Virtual Host
language: nginx
tags: nginx, web-server, config
---
```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/example.com;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php-fpm.sock;
    }

    # Redirect HTTP to HTTPS
    # return 301 https://$server_name$request_uri;
}
```

---

---
uid: 01a1f623-acab-7557-9e71-a893df4fc708
title: TypeScript React Component Template
language: typescript
tags: react, typescript, template
---
```typescript
import React, { useState, useCallback } from 'react';

interface Props {
  title: string;
  onClose?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onClose }) => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Count: {count}
      </button>
    </div>
  );
};
```

---

---
uid: 01a1f623-acac-7482-a6d4-bfefa4fa8efb
title: Docker Compose Database Stack
language: yaml
tags: docker, docker-compose, database
---
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: my_postgres
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - mynetwork

  redis:
    image: redis:7-alpine
    container_name: my_redis
    ports:
      - "6379:6379"
    networks:
      - mynetwork

volumes:
  postgres_data:

networks:
  mynetwork:
    driver: bridge
```

---

---
uid: 01a1f623-acad-7a5d-8950-f38b42659772
title: Cron Job Examples
language: bash
tags: cron, scheduling, automation
---
```bash
# Edit current user's crontab
crontab -e

# Examples:
# Run every day at 2:30 AM
30 2 * * * /home/user/backup.sh

# Every 15 minutes
*/15 * * * * /usr/local/bin/check_status.sh

# Every Monday at 9 AM
0 9 * * 1 /usr/local/bin/weekly_report.sh

# Every 1st of month at midnight
0 0 1 * * /usr/local/bin/monthly_cleanup.sh

# Reboot at 3 AM daily
0 3 * * * /sbin/reboot

# View active crontab
crontab -l

# Remove all cron jobs
crontab -r
```

---

---
uid: 01a1f623-acae-7818-9e02-a6bbfb5271b7
title: Node.js Project Setup (pnpm)
language: bash
tags: node, pnpm, setup
---
```bash
# Create a new project
pnpm init

# Install dependencies
pnpm add express zod
pnpm add -D typescript @types/node tsx vitest

# Initialize TypeScript config
pnpm exec tsc --init

# Run scripts defined in package.json
pnpm dev
pnpm build
pnpm test

# Clean install from lockfile (CI-friendly)
pnpm install --frozen-lockfile

# Update all deps to latest within semver range
pnpm update
```

---

---
uid: 01a1f623-acaf-7b6c-ab77-b85916908b86
title: package.json Useful Scripts
language: json
tags: node, npm, package-json
---
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit"
  },
  "engines": {
    "node": ">=20"
  }
}
```

---

---
uid: 01a1f623-acb0-7f3e-8662-aefd6efad86d
title: Express.js REST API Starter
language: javascript
tags: node, express, api
---
```javascript
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/items", (_req, res) => {
  res.json([{ id: 1, name: "Example" }]);
});

app.post("/api/items", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  res.status(201).json({ id: Date.now(), name });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
```

---

---
uid: 01a1f623-acb1-7629-9652-b6dc8b48afbb
title: Python Virtual Environment Commands
language: bash
tags: python, venv, setup
---
```bash
# Create a virtual environment
python3 -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows PowerShell)
# .venv\Scripts\Activate.ps1

# Install deps
pip install -r requirements.txt
pip install requests httpx pydantic

# Freeze current environment
pip freeze > requirements.txt

# Deactivate
deactivate

# Remove venv entirely
rm -rf .venv
```

---

---
uid: 01a1f623-acb2-7c0e-bc7f-652119512653
title: Python argparse CLI Template
language: python
tags: python, cli, argparse
---
```python
#!/usr/bin/env python3
import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="Process files in a directory")
    parser.add_argument("input", type=Path, help="Input file or directory")
    parser.add_argument("-o", "--output", type=Path, help="Output path")
    parser.add_argument("-v", "--verbose", action="store_true", help="Verbose output")
    parser.add_argument("-n", "--dry-run", action="store_true", help="Show actions without writing")
    args = parser.parse_args()

    if not args.input.exists():
        parser.error(f"not found: {args.input}")

    if args.verbose:
        print(f"Processing {args.input}")

    # ... your logic here ...

    return 0


if __name__ == "__main__":
    sys.exit(main())
```

---

---
uid: 01a1f623-acb3-7c57-9206-1bf272110e44
title: Python HTTP Requests with Retries
language: python
tags: python, http, requests
---
```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=0.5,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET", "POST", "PUT", "DELETE"],
)
session.mount("https://", HTTPAdapter(max_retries=retries))
session.mount("http://", HTTPAdapter(max_retries=retries))

def fetch_json(url: str, **kwargs) -> dict:
    response = session.get(url, timeout=10, **kwargs)
    response.raise_for_status()
    return response.json()

# Usage
# data = fetch_json("https://api.example.com/users")
```

---

---
uid: 01a1f623-acb4-7593-8e91-8568e99ac492
title: pyproject.toml Minimal
language: toml
tags: python, packaging, toml
---
```toml
[project]
name = "my-package"
version = "0.1.0"
description = "A small Python package"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "requests>=2.31",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "ruff>=0.4", "mypy>=1.10"]

[project.scripts]
my-cli = "my_package.cli:main"

[tool.pytest.ini_options]
testpaths = ["tests"]

[tool.ruff]
line-length = 88
target-version = "py311"
```

---

---
uid: 01a1f623-acb5-7466-869f-7929ba8607b0
title: HTML5 Semantic Boilerplate
language: html
tags: web, html, boilerplate
---
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Page description for SEO" />
    <title>My App</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header>
      <nav aria-label="Main navigation">
        <a href="/">Home</a>
      </nav>
    </header>

    <main id="app">
      <h1>Hello, world</h1>
    </main>

    <footer>
      <p>&copy; 2026 My App</p>
    </footer>

    <script type="module" src="/main.js"></script>
  </body>
</html>
```

---

---
uid: 01a1f623-acb6-7183-bfdb-c659cff6d7b7
title: CSS Flexbox and Grid Patterns
language: css
tags: web, css, layout
---
```css
/* Center content (flex) */
.center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* Responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Sticky footer layout */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.page main {
  flex: 1;
}

/* Truncate long text with ellipsis */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

---
uid: 01a1f623-acb7-7ff9-83e5-6471fffd9eb8
title: Fetch API with TypeScript
language: typescript
tags: web, fetch, typescript
---
```typescript
type ApiError = { error: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as ApiError;
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

// Usage: const user = await api<User>("/api/users/1");
```

---

---
uid: 01a1f623-acb8-7c59-9ada-ba37a5c162b0
title: Vite Config Template
language: typescript
tags: web, vite, bundler
---
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    outDir: "dist",
  },
});
```

---

---
uid: 01a1f623-acb9-7f8c-a30a-2cad7615b63b
title: GitHub Actions CI Pipeline
language: yaml
tags: ci, github-actions, node
---
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

---

---
uid: 01a1f623-acba-7f4a-a322-39739a178631
title: Common SQL Queries
language: sql
tags: sql, database, queries
---
```sql
-- List tables (SQLite)
SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;

-- Recent rows
SELECT * FROM snippets ORDER BY updated_at DESC LIMIT 20;

-- Count by category
SELECT language, COUNT(*) AS total
FROM snippets
GROUP BY language
ORDER BY total DESC;

-- Find duplicates
SELECT title, COUNT(*) AS cnt
FROM snippets
GROUP BY title
HAVING cnt > 1;

-- Safe update with transaction
BEGIN;
UPDATE snippets SET favorite = 1 WHERE id = ?;
COMMIT;
```

---

---
uid: 01a1f623-acbb-7b4a-894e-97fa36a90dcb
title: curl API Testing Commands
language: bash
tags: api, curl, http, testing
---
```bash
# GET with pretty JSON (requires jq)
curl -s https://api.example.com/users | jq .

# POST JSON body
curl -s -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# Bearer token auth
curl -s -H "Authorization: Bearer $TOKEN" https://api.example.com/me

# Show response headers and status
curl -i https://api.example.com/health

# Follow redirects, fail on HTTP errors
curl -fsSL https://api.example.com/download -o output.bin

# Local dev server
curl -X POST http://localhost:3000/api/items -H "Content-Type: application/json" -d '{"name":"test"}'
```

---

---
uid: 01a1f623-acbc-71ca-82bb-b7aef2e62ef5
title: Environment Variables Template
language: bash
tags: env, config, devops
---
```bash
# Copy to .env and fill in values — never commit secrets
# cp .env.example .env

# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# Auth
JWT_SECRET=change-me-in-production
SESSION_SECRET=change-me-too

# Third-party APIs
STRIPE_API_KEY=sk_test_...
OPENAI_API_KEY=sk-...

# Feature flags
DEBUG=true
LOG_LEVEL=info
```

---
