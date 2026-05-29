import type { Snippet } from "./types";

export const mockSnippets: Snippet[] = [
  {
    id: 1,
    title: "Find large files on disk",
    description: "List top 20 files by size, sorted descending",
    language: "bash",
    code: `find / -type f -printf '%s\\t%p\\n' 2>/dev/null \\
  | sort -rn \\
  | head -20 \\
  | awk '{printf "%s\\t%s\\n", $1/1024/1024 "MB", $2}'`,
    notes: "Run as root for full coverage. Skips permission errors via stderr redirect.",
    favorite: true,
    tags: ["linux", "disk", "sysadmin"],
    created_at: 1700000000,
    updated_at: 1700100000,
  },
  {
    id: 2,
    title: "Retry with exponential backoff",
    description: "Decorator that retries a function on exception",
    language: "python",
    code: `import time, functools

def retry(max_attempts=3, base_delay=1.0, exceptions=(Exception,)):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return fn(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(base_delay * 2**attempt)
        return wrapper
    return decorator

@retry(max_attempts=5, base_delay=0.5)
def fetch_data(url: str) -> dict:
    ...`,
    notes: "Works well for network calls. Pass specific exception types to avoid swallowing bugs.",
    favorite: false,
    tags: ["python", "utils", "networking"],
    created_at: 1700200000,
    updated_at: 1700200000,
  },
  {
    id: 3,
    title: "Docker Compose — Postgres + Redis",
    description: "Local dev stack with Postgres 16 and Redis 7",
    language: "yaml",
    code: `services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
    notes: "Swap alpine for the full image if you need locale support. Add `healthcheck` blocks before dependent services.",
    favorite: true,
    tags: ["docker", "postgres", "redis", "devops"],
    created_at: 1700300000,
    updated_at: 1700400000,
  },
  {
    id: 4,
    title: "Rust — anyhow error context chain",
    description: "Pattern for adding context to errors without losing the source",
    language: "rust",
    code: `use anyhow::{Context, Result};

fn read_config(path: &str) -> Result<Config> {
    let contents = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read config at {path}"))?;

    let config: Config = toml::from_str(&contents)
        .context("config file is not valid TOML")?;

    Ok(config)
}`,
    notes: "Use `context()` for static messages, `with_context(|| ...)` when building the message is expensive or needs runtime data.",
    favorite: false,
    tags: ["rust", "error-handling"],
    created_at: 1700500000,
    updated_at: 1700500000,
  },
  {
    id: 5,
    title: "TypeScript — deep readonly utility",
    description: "Recursively marks every property as readonly",
    language: "typescript",
    code: `type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// Usage
type Config = DeepReadonly<{
  db: { host: string; port: number };
  flags: string[];
}>;`,
    notes: "Useful for config objects you want to freeze at the type level. Combine with `Object.freeze` for runtime safety.",
    favorite: false,
    tags: ["typescript", "types", "utils"],
    created_at: 1700600000,
    updated_at: 1700600000,
  },
  {
    id: 6,
    title: "SQL — top N per group (window)",
    description: "Rank rows within groups and take the top N",
    language: "sql",
    code: `WITH ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY score DESC
    ) AS rn
  FROM products
)
SELECT *
FROM ranked
WHERE rn <= 3
ORDER BY category, rn;`,
    notes: "ROW_NUMBER skips ties. Use RANK() to include ties or DENSE_RANK() for consecutive ranks without gaps.",
    favorite: true,
    tags: ["sql", "window-functions", "postgres"],
    created_at: 1700700000,
    updated_at: 1700700000,
  },
  {
    id: 7,
    title: "Caddy — reverse proxy with HTTPS",
    description: "Minimal Caddyfile for proxying a local service",
    language: "nginx",
    code: `app.example.com {
    reverse_proxy localhost:3000

    encode gzip

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        -Server
    }
}`,
    notes: "Caddy auto-provisions TLS via Let's Encrypt. Port 80/443 must be open. Replace localhost:3000 with your upstream.",
    favorite: false,
    tags: ["caddy", "https", "devops", "networking"],
    created_at: 1700800000,
    updated_at: 1700900000,
  },
  {
    id: 8,
    title: "Git — useful aliases",
    description: "Quality-of-life git config aliases",
    language: "bash",
    code: `git config --global alias.lg \\
  "log --oneline --graph --decorate --all"

git config --global alias.st "status -sb"
git config --global alias.co "checkout"
git config --global alias.br "branch -vv"
git config --global alias.undo "reset HEAD~1 --mixed"
git config --global alias.aliases "config --get-regexp alias"`,
    notes: "`git undo` is non-destructive — keeps changes in working tree. Run `git aliases` to list all configured aliases.",
    favorite: false,
    tags: ["git", "linux", "workflow"],
    created_at: 1700950000,
    updated_at: 1700950000,
  },
  {
    id: 9,
    title: "Python — dataclass with validation",
    description: "Pydantic v2 model with field validators",
    language: "python",
    code: `from pydantic import BaseModel, field_validator, model_validator
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    age: Optional[int] = None

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace("_", "").isalnum():
            raise ValueError("username must be alphanumeric")
        return v.lower()

    @model_validator(mode="after")
    def check_age(self) -> "UserCreate":
        if self.age is not None and self.age < 13:
            raise ValueError("age must be 13 or older")
        return self`,
    notes: "field_validator runs before model_validator. Use mode='before' on field validators to transform raw input first.",
    favorite: false,
    tags: ["python", "pydantic", "validation"],
    created_at: 1701000000,
    updated_at: 1701000000,
  },
  {
    id: 10,
    title: "JavaScript — debounce",
    description: "Delay a function call until input settles",
    language: "javascript",
    code: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage
const handleSearch = debounce((query) => {
  console.log("searching:", query);
}, 300);`,
    notes: "For leading-edge fire (execute immediately, then suppress), flip the logic: call fn on first invocation and block subsequent ones within the window.",
    favorite: false,
    tags: ["javascript", "utils", "performance"],
    created_at: 1701100000,
    updated_at: 1701100000,
  },
];
