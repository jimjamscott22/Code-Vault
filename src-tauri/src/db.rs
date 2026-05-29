use anyhow::{Context, Result};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
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
    Ok(conn)
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
