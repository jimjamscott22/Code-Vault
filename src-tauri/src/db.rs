use anyhow::{Context, Result};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Snippet {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub language: String,
    pub code: String,
    pub notes: String,
    pub favorite: bool,
    pub tags: Vec<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Deserialize)]
pub struct NewSnippet {
    pub title: String,
    pub description: String,
    pub language: String,
    pub code: String,
    pub notes: String,
    pub favorite: bool,
    pub tags: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct SnippetPatch {
    pub title: Option<String>,
    pub description: Option<String>,
    pub language: Option<String>,
    pub code: Option<String>,
    pub notes: Option<String>,
    pub favorite: Option<bool>,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64
}

fn parse_tags(raw: &str) -> Vec<String> {
    if raw.is_empty() {
        vec![]
    } else {
        raw.split(',').map(|s| s.to_string()).collect()
    }
}

fn row_to_snippet(row: &rusqlite::Row<'_>) -> rusqlite::Result<Snippet> {
    let favorite: i64 = row.get(6)?;
    let tag_names: String = row.get(7)?;
    Ok(Snippet {
        id: row.get(0)?,
        title: row.get(1)?,
        description: row.get(2)?,
        language: row.get(3)?,
        code: row.get(4)?,
        notes: row.get(5)?,
        favorite: favorite != 0,
        tags: parse_tags(&tag_names),
        created_at: row.get(8)?,
        updated_at: row.get(9)?,
    })
}

const SNIPPET_SELECT: &str = "
    SELECT
        s.id, s.title, s.description, s.language, s.code, s.notes,
        s.favorite,
        COALESCE(GROUP_CONCAT(t.name, ','), '') AS tag_names,
        s.created_at, s.updated_at
    FROM snippets s
    LEFT JOIN snippet_tags st ON s.id = st.snippet_id
    LEFT JOIN tags t ON t.id = st.tag_id
";

// ---------------------------------------------------------------------------
// DB init + migrations
// ---------------------------------------------------------------------------

pub fn init_db(app: &AppHandle) -> Result<Connection> {
    let data_dir = app
        .path()
        .app_data_dir()
        .context("failed to resolve app data directory")?;
    std::fs::create_dir_all(&data_dir).context("failed to create app data directory")?;

    let db_path = data_dir.join("vault.db");
    let conn = Connection::open(&db_path)
        .with_context(|| format!("failed to open database at {}", db_path.display()))?;

    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")
        .context("failed to set PRAGMA options")?;

    migrate(&conn)?;

    // Launch-time backup: checkpoint the WAL so the main file is current,
    // then snapshot it. Failures here must never block startup.
    let _ = conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);");
    if let Err(err) = backup_db(&data_dir, &db_path) {
        eprintln!("backup skipped: {err}");
    }

    Ok(conn)
}

const BACKUP_PREFIX: &str = "vault.db.bak-";
const BACKUPS_TO_KEEP: usize = 7;

/// Copy `vault.db` to `vault.db.bak-YYYY-MM-DD` (once per day), then prune to
/// the most recent `BACKUPS_TO_KEEP` backups.
fn backup_db(data_dir: &Path, db_path: &Path) -> Result<()> {
    if !db_path.exists() || std::fs::metadata(db_path)?.len() == 0 {
        return Ok(()); // nothing to back up yet
    }

    let (y, m, d) = ymd_from_unix(now());
    let name = format!("{BACKUP_PREFIX}{y:04}-{m:02}-{d:02}");
    let dest = data_dir.join(&name);
    if !dest.exists() {
        std::fs::copy(db_path, &dest)
            .with_context(|| format!("failed to write backup {name}"))?;
    }

    // Prune: collect backups, sort by name (dates sort chronologically), drop oldest.
    let mut backups: Vec<_> = std::fs::read_dir(data_dir)?
        .filter_map(|e| e.ok())
        .map(|e| e.file_name().to_string_lossy().into_owned())
        .filter(|n| n.starts_with(BACKUP_PREFIX))
        .collect();
    backups.sort();
    if backups.len() > BACKUPS_TO_KEEP {
        for old in &backups[..backups.len() - BACKUPS_TO_KEEP] {
            let _ = std::fs::remove_file(data_dir.join(old));
        }
    }
    Ok(())
}

/// Civil date (year, month, day) from a Unix timestamp, UTC.
/// Based on Howard Hinnant's days-from-civil algorithm.
fn ymd_from_unix(secs: i64) -> (i64, u32, u32) {
    let days = secs.div_euclid(86_400);
    let z = days + 719_468;
    let era = z.div_euclid(146_097);
    let doe = z - era * 146_097;
    let yoe = (doe - doe / 1460 + doe / 36_524 - doe / 146_096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = (doy - (153 * mp + 2) / 5 + 1) as u32;
    let m = if mp < 10 { mp + 3 } else { mp - 9 } as u32;
    let y = if m <= 2 { y + 1 } else { y };
    (y, m, d)
}

fn migrate(conn: &Connection) -> Result<()> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY);",
    )?;

    let version: i64 = conn
        .query_row(
            "SELECT COALESCE(MAX(version), 0) FROM schema_version",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let migrations: &[(i64, &str)] = &[(
        1,
        "CREATE TABLE IF NOT EXISTS snippets (
             id          INTEGER PRIMARY KEY AUTOINCREMENT,
             title       TEXT    NOT NULL,
             description TEXT    NOT NULL DEFAULT '',
             language    TEXT    NOT NULL DEFAULT '',
             code        TEXT    NOT NULL DEFAULT '',
             notes       TEXT    NOT NULL DEFAULT '',
             favorite    INTEGER NOT NULL DEFAULT 0,
             created_at  INTEGER NOT NULL,
             updated_at  INTEGER NOT NULL
         );
         CREATE TABLE IF NOT EXISTS tags (
             id   INTEGER PRIMARY KEY AUTOINCREMENT,
             name TEXT UNIQUE NOT NULL
         );
         CREATE TABLE IF NOT EXISTS snippet_tags (
             snippet_id INTEGER NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
             tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
             PRIMARY KEY (snippet_id, tag_id)
         );",
    )];

    for (v, sql) in migrations {
        if *v > version {
            conn.execute_batch(sql)
                .with_context(|| format!("migration v{v} failed"))?;
            conn.execute(
                "INSERT OR REPLACE INTO schema_version VALUES (?1)",
                params![v],
            )?;
        }
    }

    Ok(())
}

// ---------------------------------------------------------------------------
// Repository functions
// ---------------------------------------------------------------------------

pub fn list_snippets(conn: &Connection) -> Result<Vec<Snippet>> {
    let sql = format!("{SNIPPET_SELECT} GROUP BY s.id ORDER BY s.updated_at DESC");
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map([], row_to_snippet)?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

pub fn get_snippet(conn: &Connection, id: i64) -> Result<Snippet> {
    let sql = format!("{SNIPPET_SELECT} WHERE s.id = ?1 GROUP BY s.id");
    conn.query_row(&sql, params![id], row_to_snippet)
        .with_context(|| format!("snippet {id} not found"))
}

pub fn create_snippet(conn: &Connection, input: NewSnippet) -> Result<Snippet> {
    let ts = now();
    conn.execute(
        "INSERT INTO snippets (title, description, language, code, notes, favorite, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            input.title,
            input.description,
            input.language,
            input.code,
            input.notes,
            input.favorite as i64,
            ts,
            ts
        ],
    )?;
    let id = conn.last_insert_rowid();
    set_snippet_tags(conn, id, &input.tags)?;
    get_snippet(conn, id)
}

pub fn update_snippet(conn: &Connection, id: i64, patch: SnippetPatch) -> Result<Snippet> {
    conn.execute(
        "UPDATE snippets SET
             title       = COALESCE(?1, title),
             description = COALESCE(?2, description),
             language    = COALESCE(?3, language),
             code        = COALESCE(?4, code),
             notes       = COALESCE(?5, notes),
             favorite    = COALESCE(?6, favorite),
             updated_at  = ?7
         WHERE id = ?8",
        params![
            patch.title,
            patch.description,
            patch.language,
            patch.code,
            patch.notes,
            patch.favorite.map(|b| b as i64),
            now(),
            id
        ],
    )?;
    get_snippet(conn, id)
}

pub fn delete_snippet(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM snippets WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn toggle_favorite(conn: &Connection, id: i64) -> Result<bool> {
    conn.execute(
        "UPDATE snippets SET favorite = NOT favorite, updated_at = ?1 WHERE id = ?2",
        params![now(), id],
    )?;
    let fav: i64 =
        conn.query_row("SELECT favorite FROM snippets WHERE id = ?1", params![id], |r| {
            r.get(0)
        })?;
    Ok(fav != 0)
}

pub fn list_tags(conn: &Connection) -> Result<Vec<String>> {
    let mut stmt = conn.prepare("SELECT name FROM tags ORDER BY name")?;
    let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

pub fn set_snippet_tags(conn: &Connection, snippet_id: i64, tag_names: &[String]) -> Result<()> {
    conn.execute(
        "DELETE FROM snippet_tags WHERE snippet_id = ?1",
        params![snippet_id],
    )?;
    for name in tag_names {
        let name = name.trim();
        if name.is_empty() {
            continue;
        }
        conn.execute(
            "INSERT OR IGNORE INTO tags (name) VALUES (?1)",
            params![name],
        )?;
        let tag_id: i64 =
            conn.query_row("SELECT id FROM tags WHERE name = ?1", params![name], |r| {
                r.get(0)
            })?;
        conn.execute(
            "INSERT OR IGNORE INTO snippet_tags (snippet_id, tag_id) VALUES (?1, ?2)",
            params![snippet_id, tag_id],
        )?;
    }
    Ok(())
}

pub fn search_snippets(conn: &Connection, query: &str) -> Result<Vec<Snippet>> {
    let pattern = format!("%{query}%");
    let sql = format!(
        "{SNIPPET_SELECT}
         WHERE s.title LIKE ?1 OR s.code LIKE ?1 OR s.notes LIKE ?1
            OR EXISTS (
                SELECT 1 FROM snippet_tags st2
                JOIN tags t2 ON t2.id = st2.tag_id
                WHERE st2.snippet_id = s.id AND t2.name LIKE ?1
            )
         GROUP BY s.id
         ORDER BY s.updated_at DESC"
    );
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params![pattern], row_to_snippet)?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

// ---------------------------------------------------------------------------
// Import / export
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize)]
pub struct VaultExport {
    pub version: i64,
    pub exported_at: i64,
    pub snippets: Vec<Snippet>,
}

#[derive(Debug, Serialize, Default)]
pub struct ImportResult {
    pub imported: usize,
    pub overwritten: usize,
    pub skipped: usize,
    pub renamed: usize,
}

/// A snippet as it arrives from an import file — every field but the title is
/// optional so partial / hand-written JSON still loads.
#[derive(Debug, Deserialize)]
struct ImportSnippet {
    title: String,
    #[serde(default)]
    description: String,
    #[serde(default)]
    language: String,
    #[serde(default)]
    code: String,
    #[serde(default)]
    notes: String,
    #[serde(default)]
    favorite: bool,
    #[serde(default)]
    tags: Vec<String>,
    #[serde(default)]
    created_at: Option<i64>,
    #[serde(default)]
    updated_at: Option<i64>,
}

#[derive(Debug, Deserialize)]
struct VaultImport {
    #[serde(default)]
    snippets: Vec<ImportSnippet>,
}

pub fn export_json(conn: &Connection) -> Result<String> {
    let export = VaultExport {
        version: 1,
        exported_at: now(),
        snippets: list_snippets(conn)?,
    };
    serde_json::to_string_pretty(&export).context("failed to serialise vault")
}

/// Import a JSON export. `strategy` is one of `skip` | `overwrite` | `rename`
/// and decides what happens when an incoming title already exists.
pub fn import_vault_json(conn: &Connection, json: &str, strategy: &str) -> Result<ImportResult> {
    // Accept either the wrapped `{ "snippets": [...] }` form or a bare array.
    let incoming: Vec<ImportSnippet> = match serde_json::from_str::<VaultImport>(json) {
        Ok(v) if !v.snippets.is_empty() => v.snippets,
        _ => serde_json::from_str(json).context("file is not a valid CodeVault export")?,
    };

    let mut result = ImportResult::default();
    for snip in incoming {
        let existing: Option<i64> = conn
            .query_row(
                "SELECT id FROM snippets WHERE title = ?1",
                params![snip.title],
                |r| r.get(0),
            )
            .ok();

        match (existing, strategy) {
            (Some(_), "skip") => result.skipped += 1,
            (Some(id), "overwrite") => {
                overwrite_snippet(conn, id, &snip)?;
                result.overwritten += 1;
            }
            (Some(_), _) => {
                // "rename" (and any unknown strategy): insert under a unique title
                let title = unique_title(conn, &snip.title)?;
                insert_full(conn, &snip, &title)?;
                result.renamed += 1;
            }
            (None, _) => {
                insert_full(conn, &snip, &snip.title)?;
                result.imported += 1;
            }
        }
    }
    Ok(result)
}

fn insert_full(conn: &Connection, s: &ImportSnippet, title: &str) -> Result<i64> {
    let created = s.created_at.unwrap_or_else(now);
    let updated = s.updated_at.unwrap_or_else(now);
    conn.execute(
        "INSERT INTO snippets (title, description, language, code, notes, favorite, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            title,
            s.description,
            s.language,
            s.code,
            s.notes,
            s.favorite as i64,
            created,
            updated
        ],
    )?;
    let id = conn.last_insert_rowid();
    set_snippet_tags(conn, id, &s.tags)?;
    Ok(id)
}

fn overwrite_snippet(conn: &Connection, id: i64, s: &ImportSnippet) -> Result<()> {
    conn.execute(
        "UPDATE snippets SET description = ?1, language = ?2, code = ?3,
             notes = ?4, favorite = ?5, updated_at = ?6 WHERE id = ?7",
        params![
            s.description,
            s.language,
            s.code,
            s.notes,
            s.favorite as i64,
            s.updated_at.unwrap_or_else(now),
            id
        ],
    )?;
    set_snippet_tags(conn, id, &s.tags)?;
    Ok(())
}

fn unique_title(conn: &Connection, base: &str) -> Result<String> {
    let mut n = 2;
    loop {
        let candidate = format!("{base} ({n})");
        let exists: bool = conn
            .query_row(
                "SELECT 1 FROM snippets WHERE title = ?1",
                params![candidate],
                |_| Ok(true),
            )
            .unwrap_or(false);
        if !exists {
            return Ok(candidate);
        }
        n += 1;
    }
}

/// Import a single Markdown file. A leading `---` front-matter block supplies
/// `title`, `language`, and comma-separated `tags`; the remaining body becomes
/// the snippet's code. Missing front-matter falls back to sensible defaults.
pub fn import_markdown(conn: &Connection, content: &str) -> Result<Snippet> {
    let (front, body) = split_front_matter(content);

    let mut title = String::new();
    let mut language = String::new();
    let mut tags: Vec<String> = vec![];

    for line in front.lines() {
        let Some((key, value)) = line.split_once(':') else {
            continue;
        };
        let value = value.trim().trim_matches(|c| c == '"' || c == '\'');
        match key.trim().to_lowercase().as_str() {
            "title" => title = value.to_string(),
            "language" | "lang" => language = value.to_string(),
            "tags" => {
                tags = value
                    .trim_matches(|c| c == '[' || c == ']')
                    .split(',')
                    .map(|t| t.trim().to_string())
                    .filter(|t| !t.is_empty())
                    .collect()
            }
            _ => {}
        }
    }

    if title.is_empty() {
        title = "Imported snippet".to_string();
    }

    let input = NewSnippet {
        title,
        description: String::new(),
        language,
        code: body.trim().to_string(),
        notes: String::new(),
        favorite: false,
        tags,
    };
    create_snippet(conn, input)
}

/// Split a `---`-delimited YAML front-matter header from the body.
/// Returns `(front_matter, body)`; front is empty when there is no header.
fn split_front_matter(content: &str) -> (&str, &str) {
    let trimmed = content.trim_start();
    let Some(rest) = trimmed.strip_prefix("---") else {
        return ("", content);
    };
    // Find the closing `---` on its own line.
    if let Some(end) = rest.find("\n---") {
        let front = &rest[..end];
        let after = &rest[end + 4..]; // skip "\n---"
        let body = after.strip_prefix('\n').unwrap_or(after);
        (front, body)
    } else {
        ("", content)
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn test_conn() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch("PRAGMA foreign_keys=ON;").unwrap();
        migrate(&conn).unwrap();
        conn
    }

    fn sample(title: &str) -> NewSnippet {
        NewSnippet {
            title: title.to_string(),
            description: String::new(),
            language: "bash".to_string(),
            code: "echo hi".to_string(),
            notes: String::new(),
            favorite: false,
            tags: vec!["shell".to_string()],
        }
    }

    #[test]
    fn import_inserts_new_snippets() {
        let conn = test_conn();
        let json = r#"{"snippets":[{"title":"A","code":"a"},{"title":"B","code":"b"}]}"#;
        let r = import_vault_json(&conn, json, "rename").unwrap();
        assert_eq!(r.imported, 2);
        assert_eq!(list_snippets(&conn).unwrap().len(), 2);
    }

    #[test]
    fn import_accepts_bare_array() {
        let conn = test_conn();
        let json = r#"[{"title":"A","code":"a"}]"#;
        let r = import_vault_json(&conn, json, "skip").unwrap();
        assert_eq!(r.imported, 1);
    }

    #[test]
    fn import_skip_leaves_existing_untouched() {
        let conn = test_conn();
        create_snippet(&conn, sample("Dup")).unwrap();
        let json = r#"{"snippets":[{"title":"Dup","code":"changed"}]}"#;
        let r = import_vault_json(&conn, json, "skip").unwrap();
        assert_eq!(r.skipped, 1);
        let all = list_snippets(&conn).unwrap();
        assert_eq!(all.len(), 1);
        assert_eq!(all[0].code, "echo hi"); // unchanged
    }

    #[test]
    fn import_overwrite_replaces_body() {
        let conn = test_conn();
        create_snippet(&conn, sample("Dup")).unwrap();
        let json = r#"{"snippets":[{"title":"Dup","code":"changed"}]}"#;
        let r = import_vault_json(&conn, json, "overwrite").unwrap();
        assert_eq!(r.overwritten, 1);
        let all = list_snippets(&conn).unwrap();
        assert_eq!(all.len(), 1);
        assert_eq!(all[0].code, "changed");
    }

    #[test]
    fn import_rename_adds_suffixed_copy() {
        let conn = test_conn();
        create_snippet(&conn, sample("Dup")).unwrap();
        let json = r#"{"snippets":[{"title":"Dup","code":"copy"}]}"#;
        let r = import_vault_json(&conn, json, "rename").unwrap();
        assert_eq!(r.renamed, 1);
        let titles: Vec<_> = list_snippets(&conn).unwrap().into_iter().map(|s| s.title).collect();
        assert!(titles.contains(&"Dup".to_string()));
        assert!(titles.contains(&"Dup (2)".to_string()));
    }

    #[test]
    fn markdown_front_matter_is_parsed() {
        let conn = test_conn();
        let md = "---\ntitle: Restart Pi-hole\nlanguage: bash\ntags: linux, pihole\n---\npihole restartdns\n";
        let snip = import_markdown(&conn, md).unwrap();
        assert_eq!(snip.title, "Restart Pi-hole");
        assert_eq!(snip.language, "bash");
        assert_eq!(snip.code, "pihole restartdns");
        assert_eq!(snip.tags, vec!["linux".to_string(), "pihole".to_string()]);
    }

    #[test]
    fn markdown_without_front_matter_falls_back() {
        let conn = test_conn();
        let snip = import_markdown(&conn, "just some code").unwrap();
        assert_eq!(snip.title, "Imported snippet");
        assert_eq!(snip.code, "just some code");
    }

    #[test]
    fn export_roundtrips_through_import() {
        let conn = test_conn();
        create_snippet(&conn, sample("One")).unwrap();
        create_snippet(&conn, sample("Two")).unwrap();
        let json = export_json(&conn).unwrap();

        let conn2 = test_conn();
        let r = import_vault_json(&conn2, &json, "rename").unwrap();
        assert_eq!(r.imported, 2);
        assert_eq!(list_snippets(&conn2).unwrap().len(), 2);
    }

    #[test]
    fn ymd_conversion_is_correct() {
        // 2021-01-01 00:00:00 UTC = 1609459200
        assert_eq!(ymd_from_unix(1_609_459_200), (2021, 1, 1));
        // 1970-01-01
        assert_eq!(ymd_from_unix(0), (1970, 1, 1));
    }
}
