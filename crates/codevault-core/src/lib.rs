use anyhow::{Context, Result};
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::collections::{BTreeSet, HashSet};
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::{NoContext, Timestamp, Uuid};

pub mod template;
pub use template::{parse_placeholders, render_template, Placeholder};

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Snippet {
    /// Local row id. Only meaningful inside this vault — never use it to
    /// match snippets across vaults or files; that's what `uid` is for.
    pub id: i64,
    /// Stable, globally unique identity (UUIDv7, lowercase hyphenated).
    /// Assigned once at creation and never changed; carried through JSON
    /// export and Markdown front matter so re-imports match the same snippet.
    pub uid: String,
    pub title: String,
    pub description: String,
    pub language: String,
    pub code: String,
    pub notes: String,
    pub favorite: bool,
    pub tags: Vec<String>,
    pub folder_id: Option<i64>,
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
    #[serde(default)]
    pub folder_id: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Folder {
    pub id: i64,
    pub name: String,
    pub created_at: i64,
}

#[derive(Debug, Deserialize)]
pub struct NewFolder {
    pub name: String,
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TagCategory {
    pub id: i64,
    pub name: String,
    pub sort_order: i64,
    pub created_at: i64,
}

#[derive(Debug, Deserialize)]
pub struct NewTagCategory {
    pub name: String,
}

/// One row per known tag, with its category (if any). Distinct from
/// `Snippet.tags` (a flat `Vec<String>`) — this is the lookup table the
/// frontend joins against tag names to build grouped sections.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TagWithCategory {
    pub name: String,
    pub category_id: Option<i64>,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

pub fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64
}

/// A fresh UUIDv7 for a new snippet. Time-ordered, so uids sort roughly by
/// creation and index well.
pub fn new_uid() -> String {
    Uuid::now_v7().to_string()
}

/// Validate a uid coming from outside (an import file) and return it in the
/// canonical lowercase-hyphenated form, so `ABC…`, `{abc…}` and `abc…` all
/// match the same stored row.
fn normalize_uid(raw: &str) -> Result<String> {
    Uuid::parse_str(raw.trim())
        .map(|u| u.to_string())
        .with_context(|| format!("invalid uid {raw:?} (expected a UUID)"))
}

fn row_to_snippet(row: &rusqlite::Row<'_>) -> rusqlite::Result<Snippet> {
    let favorite: i64 = row.get(7)?;
    let tag_json: String = row.get(8)?;
    // Tags travel as a JSON array (not a delimited string) so any character,
    // including a comma, survives the round trip.
    let tags: Vec<String> = serde_json::from_str(&tag_json).map_err(|err| {
        rusqlite::Error::FromSqlConversionFailure(8, rusqlite::types::Type::Text, Box::new(err))
    })?;
    Ok(Snippet {
        id: row.get(0)?,
        uid: row.get(1)?,
        title: row.get(2)?,
        description: row.get(3)?,
        language: row.get(4)?,
        code: row.get(5)?,
        notes: row.get(6)?,
        favorite: favorite != 0,
        tags,
        created_at: row.get(9)?,
        updated_at: row.get(10)?,
        folder_id: row.get(11)?,
    })
}

const SNIPPET_SELECT: &str = "
    SELECT
        s.id, s.uid, s.title, s.description, s.language, s.code, s.notes,
        s.favorite,
        json_group_array(t.name) FILTER (WHERE t.name IS NOT NULL) AS tag_names,
        s.created_at, s.updated_at, s.folder_id
    FROM snippets s
    LEFT JOIN snippet_tags st ON s.id = st.snippet_id
    LEFT JOIN tags t ON t.id = st.tag_id
";

// ---------------------------------------------------------------------------
// DB init
// ---------------------------------------------------------------------------

/// Open (or create) the vault DB at `db_path`, apply migrations, and return
/// the connection. Does not perform the daily backup — call `backup_db`
/// separately — but if an existing vault needs migrating, a consistent
/// snapshot of it is written next to the DB first (see `snapshot_before_migrate`).
pub fn open_db(db_path: &Path) -> Result<Connection> {
    let conn = Connection::open(db_path)
        .with_context(|| format!("failed to open database at {}", db_path.display()))?;

    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")
        .context("failed to set PRAGMA options")?;

    snapshot_before_migrate(&conn, db_path)?;
    migrate(&conn)?;
    Ok(conn)
}

/// If the vault is behind `SCHEMA_VERSION`, copy it to
/// `vault.db.pre-v{SCHEMA_VERSION}` before any migration touches it. Uses
/// `VACUUM INTO`, which (unlike a file copy) includes un-checkpointed WAL
/// contents. A brand-new, empty vault (version 0) has nothing to protect.
/// Fails closed: if the snapshot can't be written, the migration doesn't run.
fn snapshot_before_migrate(conn: &Connection, db_path: &Path) -> Result<()> {
    let current = schema_version(conn)?;
    if current == 0 || current >= SCHEMA_VERSION {
        return Ok(());
    }
    let file_name = db_path
        .file_name()
        .map(|n| n.to_string_lossy().into_owned())
        .unwrap_or_else(|| "vault.db".to_string());
    let snapshot = db_path.with_file_name(format!("{file_name}.pre-v{SCHEMA_VERSION}"));
    if snapshot.exists() {
        return Ok(());
    }
    let snapshot_str = snapshot
        .to_str()
        .with_context(|| format!("snapshot path {} is not valid UTF-8", snapshot.display()))?;
    conn.execute("VACUUM INTO ?1", params![snapshot_str])
        .with_context(|| format!("failed to write pre-migration snapshot {}", snapshot.display()))?;
    Ok(())
}

// ---------------------------------------------------------------------------
// Migrations
// ---------------------------------------------------------------------------

/// The schema version `migrate` brings a vault up to.
pub const SCHEMA_VERSION: i64 = 4;

/// Plain-SQL migrations. Never edit an existing entry — append a new one.
/// Each runs in its own transaction together with its `schema_version` row.
/// (v4 needs Rust code for the uid backfill, so it lives in `migrate_v4`.)
const SQL_MIGRATIONS: &[(i64, &str)] = &[
    (
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
    ),
    (
        2,
        "CREATE TABLE IF NOT EXISTS folders (
             id         INTEGER PRIMARY KEY AUTOINCREMENT,
             name       TEXT UNIQUE NOT NULL,
             created_at INTEGER NOT NULL
         );
         ALTER TABLE snippets ADD COLUMN folder_id INTEGER;
         CREATE INDEX IF NOT EXISTS idx_snippets_folder_id ON snippets(folder_id);",
    ),
    (
        3,
        "CREATE TABLE IF NOT EXISTS tag_categories (
             id         INTEGER PRIMARY KEY AUTOINCREMENT,
             name       TEXT UNIQUE NOT NULL,
             sort_order INTEGER NOT NULL,
             created_at INTEGER NOT NULL
         );
         ALTER TABLE tags ADD COLUMN category_id INTEGER;",
    ),
];

fn schema_version(conn: &Connection) -> Result<i64> {
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY);",
    )?;
    Ok(conn.query_row(
        "SELECT COALESCE(MAX(version), 0) FROM schema_version",
        [],
        |row| row.get(0),
    )?)
}

fn migrate(conn: &Connection) -> Result<()> {
    migrate_to(conn, SCHEMA_VERSION)
}

/// Apply every migration newer than the vault's current version, up to and
/// including `target`. Split out from `migrate` so tests can build an
/// old-version vault and then upgrade it.
fn migrate_to(conn: &Connection, target: i64) -> Result<()> {
    let version = schema_version(conn)?;

    for (v, sql) in SQL_MIGRATIONS {
        if *v > version && *v <= target {
            let tx = conn.unchecked_transaction()?;
            tx.execute_batch(sql)
                .with_context(|| format!("migration v{v} failed"))?;
            tx.execute("INSERT OR REPLACE INTO schema_version VALUES (?1)", params![v])?;
            tx.commit()?;
        }
    }

    if version < 4 && target >= 4 {
        migrate_v4(conn).context("migration v4 failed")?;
    }

    Ok(())
}

/// v4: move the invariants into the schema.
///
/// - `snippets.uid`: stable UUIDv7 identity, NOT NULL UNIQUE.
/// - `snippets.folder_id` and `tags.category_id` become real foreign keys
///   (`ON DELETE SET NULL`); they were plain integers before.
/// - CHECKs: non-blank titles and names, `favorite` in (0, 1),
///   `updated_at >= created_at`.
/// - Tag and folder names are unique case-insensitively (`COLLATE NOCASE`).
///
/// SQLite can't add a foreign key or CHECK to an existing column, so this
/// rebuilds the four tables (the documented "12-step" ALTER procedure).
/// Existing rows that would violate the new rules are repaired on the way
/// in rather than rejected: case-duplicate tags/folders are merged into the
/// oldest one, dangling references become NULL, blank titles get a
/// placeholder, and `updated_at` is clamped to `created_at`.
fn migrate_v4(conn: &Connection) -> Result<()> {
    // Must be toggled outside a transaction (it's a no-op inside one).
    conn.execute_batch("PRAGMA foreign_keys=OFF;")?;
    let result = migrate_v4_inner(conn);
    conn.execute_batch("PRAGMA foreign_keys=ON;")?;
    result
}

fn migrate_v4_inner(conn: &Connection) -> Result<()> {
    let tx = conn.unchecked_transaction()?;

    // Remember AUTOINCREMENT high-water marks so ids of deleted rows are
    // still never reused after the rebuild.
    let sequences: Vec<(String, i64)> = {
        let mut stmt = tx.prepare(
            "SELECT name, seq FROM sqlite_sequence
             WHERE name IN ('snippets', 'tags', 'folders')",
        )?;
        let rows = stmt.query_map([], |r| Ok((r.get(0)?, r.get(1)?)))?;
        rows.collect::<rusqlite::Result<_>>()?
    };

    tx.execute_batch(
        "CREATE TABLE folders_new (
             id         INTEGER PRIMARY KEY AUTOINCREMENT,
             name       TEXT    NOT NULL UNIQUE COLLATE NOCASE
                                CHECK (length(trim(name)) > 0),
             created_at INTEGER NOT NULL
         );
         -- One row per case-insensitive name: the oldest wins.
         INSERT INTO folders_new (id, name, created_at)
         SELECT f.id,
                CASE WHEN length(trim(f.name)) > 0 THEN f.name
                     ELSE 'Untitled folder ' || f.id END,
                f.created_at
         FROM folders f
         WHERE f.id = (SELECT MIN(f2.id) FROM folders f2
                       WHERE f2.name = f.name COLLATE NOCASE);

         CREATE TABLE tags_new (
             id          INTEGER PRIMARY KEY AUTOINCREMENT,
             name        TEXT    NOT NULL UNIQUE COLLATE NOCASE
                                 CHECK (length(trim(name)) > 0),
             category_id INTEGER REFERENCES tag_categories(id) ON DELETE SET NULL
         );
         -- Oldest tag per case-insensitive name wins; it keeps the first
         -- valid category found among the merged duplicates.
         INSERT INTO tags_new (id, name, category_id)
         SELECT t.id, t.name,
                (SELECT t3.category_id FROM tags t3
                  WHERE t3.name = t.name COLLATE NOCASE
                    AND t3.category_id IN (SELECT id FROM tag_categories)
                  ORDER BY t3.id LIMIT 1)
         FROM tags t
         WHERE length(trim(t.name)) > 0
           AND t.id = (SELECT MIN(t2.id) FROM tags t2
                       WHERE t2.name = t.name COLLATE NOCASE);

         CREATE TABLE snippets_new (
             id          INTEGER PRIMARY KEY AUTOINCREMENT,
             uid         TEXT    NOT NULL UNIQUE,
             title       TEXT    NOT NULL CHECK (length(trim(title)) > 0),
             description TEXT    NOT NULL DEFAULT '',
             language    TEXT    NOT NULL DEFAULT '',
             code        TEXT    NOT NULL DEFAULT '',
             notes       TEXT    NOT NULL DEFAULT '',
             favorite    INTEGER NOT NULL DEFAULT 0 CHECK (favorite IN (0, 1)),
             folder_id   INTEGER REFERENCES folders(id) ON DELETE SET NULL,
             created_at  INTEGER NOT NULL,
             updated_at  INTEGER NOT NULL CHECK (updated_at >= created_at)
         );
         -- uid gets a unique placeholder here and a real UUIDv7 below.
         -- folder_id is remapped to the surviving case-merged folder; a
         -- dangling id finds no folder and becomes NULL.
         INSERT INTO snippets_new (id, uid, title, description, language, code,
                                   notes, favorite, folder_id, created_at, updated_at)
         SELECT s.id,
                'legacy-' || s.id,
                CASE WHEN length(trim(s.title)) > 0 THEN s.title
                     ELSE 'Untitled Snippet' END,
                s.description, s.language, s.code, s.notes,
                CASE WHEN s.favorite != 0 THEN 1 ELSE 0 END,
                (SELECT MIN(f2.id) FROM folders f
                   JOIN folders f2 ON f2.name = f.name COLLATE NOCASE
                  WHERE f.id = s.folder_id),
                s.created_at,
                MAX(s.updated_at, s.created_at)
         FROM snippets s;

         CREATE TABLE snippet_tags_new (
             snippet_id INTEGER NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
             tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
             PRIMARY KEY (snippet_id, tag_id)
         );
         -- Point links at the surviving tag; merged duplicates collapse.
         INSERT OR IGNORE INTO snippet_tags_new (snippet_id, tag_id)
         SELECT st.snippet_id, tn.id
         FROM snippet_tags st
         JOIN tags t      ON t.id = st.tag_id
         JOIN tags_new tn ON tn.name = t.name COLLATE NOCASE
         WHERE st.snippet_id IN (SELECT id FROM snippets);

         DROP TABLE snippet_tags;
         DROP TABLE snippets;
         DROP TABLE tags;
         DROP TABLE folders;
         ALTER TABLE folders_new      RENAME TO folders;
         ALTER TABLE tags_new         RENAME TO tags;
         ALTER TABLE snippets_new     RENAME TO snippets;
         ALTER TABLE snippet_tags_new RENAME TO snippet_tags;

         CREATE INDEX idx_snippets_folder_id   ON snippets(folder_id);
         CREATE INDEX idx_snippets_updated_at  ON snippets(updated_at);
         CREATE INDEX idx_snippet_tags_tag_id  ON snippet_tags(tag_id);
         CREATE INDEX idx_tags_category_id     ON tags(category_id);",
    )?;

    // Backfill real uids. Seed each UUIDv7's timestamp from the snippet's
    // created_at so legacy uids sort in creation order like new ones do.
    let legacy: Vec<(i64, i64)> = {
        let mut stmt = tx.prepare("SELECT id, created_at FROM snippets")?;
        let rows = stmt.query_map([], |r| Ok((r.get(0)?, r.get(1)?)))?;
        rows.collect::<rusqlite::Result<_>>()?
    };
    for (id, created_at) in legacy {
        let ts = Timestamp::from_unix(NoContext, created_at.max(0) as u64, 0);
        tx.execute(
            "UPDATE snippets SET uid = ?1 WHERE id = ?2",
            params![Uuid::new_v7(ts).to_string(), id],
        )?;
    }

    for (name, seq) in sequences {
        tx.execute("DELETE FROM sqlite_sequence WHERE name = ?1", params![name])?;
        let current: i64 = tx.query_row(
            &format!("SELECT COALESCE(MAX(id), 0) FROM {name}"),
            [],
            |r| r.get(0),
        )?;
        tx.execute(
            "INSERT INTO sqlite_sequence (name, seq) VALUES (?1, ?2)",
            params![name, seq.max(current)],
        )?;
    }

    // Foreign keys were off during the rebuild; prove nothing dangles
    // before committing.
    let violations: i64 =
        tx.query_row("SELECT COUNT(*) FROM pragma_foreign_key_check", [], |r| r.get(0))?;
    if violations > 0 {
        anyhow::bail!("{violations} foreign key violation(s) after rebuild; rolled back");
    }

    tx.execute("INSERT OR REPLACE INTO schema_version VALUES (4)", [])?;
    tx.commit()?;
    Ok(())
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

const BACKUP_PREFIX: &str = "vault.db.bak-";
const BACKUPS_TO_KEEP: usize = 7;

/// Copy `vault.db` to `vault.db.bak-YYYY-MM-DD` (once per day), then prune to
/// the most recent `BACKUPS_TO_KEEP` backups.
pub fn backup_db(data_dir: &Path, db_path: &Path) -> Result<()> {
    if !db_path.exists() || std::fs::metadata(db_path)?.len() == 0 {
        return Ok(());
    }

    let (y, m, d) = ymd_from_unix(now());
    let name = format!("{BACKUP_PREFIX}{y:04}-{m:02}-{d:02}");
    let dest = data_dir.join(&name);
    if !dest.exists() {
        std::fs::copy(db_path, &dest)
            .with_context(|| format!("failed to write backup {name}"))?;
    }

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
pub fn ymd_from_unix(secs: i64) -> (i64, u32, u32) {
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

/// Look up a snippet's local id by its stable `uid`.
fn find_id_by_uid(conn: &Connection, uid: &str) -> Result<Option<i64>> {
    match conn.query_row("SELECT id FROM snippets WHERE uid = ?1", params![uid], |r| r.get(0)) {
        Ok(id) => Ok(Some(id)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(err) => Err(err.into()),
    }
}

/// Insert a snippet and its tags atomically: either both land or neither.
pub fn create_snippet(conn: &Connection, input: NewSnippet) -> Result<Snippet> {
    let tx = conn.unchecked_transaction()?;
    let ts = now();
    tx.execute(
        "INSERT INTO snippets (uid, title, description, language, code, notes, favorite, folder_id, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            new_uid(),
            input.title,
            input.description,
            input.language,
            input.code,
            input.notes,
            input.favorite as i64,
            input.folder_id,
            ts,
            ts
        ],
    )?;
    let id = tx.last_insert_rowid();
    write_snippet_tags(&tx, id, &input.tags)?;
    tx.commit()?;
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
             updated_at  = MAX(?7, created_at)
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
    let fav: i64 = conn
        .query_row(
            "UPDATE snippets SET favorite = NOT favorite, updated_at = MAX(?1, created_at)
             WHERE id = ?2 RETURNING favorite",
            params![now(), id],
            |r| r.get(0),
        )
        .with_context(|| format!("snippet {id} not found"))?;
    Ok(fav != 0)
}

pub fn list_tags(conn: &Connection) -> Result<Vec<String>> {
    let mut stmt = conn.prepare("SELECT name FROM tags ORDER BY name")?;
    let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

/// Replace a snippet's tags atomically. Tag names are matched
/// case-insensitively (the `tags.name` column is `COLLATE NOCASE`), so
/// "Linux" reuses an existing "linux" tag rather than creating a twin.
pub fn set_snippet_tags(conn: &Connection, snippet_id: i64, tag_names: &[String]) -> Result<()> {
    let tx = conn.unchecked_transaction()?;
    write_snippet_tags(&tx, snippet_id, tag_names)?;
    tx.commit()?;
    Ok(())
}

/// The body of `set_snippet_tags`, without its own transaction, for callers
/// that are already inside one (SQLite transactions don't nest).
fn write_snippet_tags(conn: &Connection, snippet_id: i64, tag_names: &[String]) -> Result<()> {
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

fn row_to_tag_category(row: &rusqlite::Row<'_>) -> rusqlite::Result<TagCategory> {
    Ok(TagCategory {
        id: row.get(0)?,
        name: row.get(1)?,
        sort_order: row.get(2)?,
        created_at: row.get(3)?,
    })
}

pub fn list_tag_categories(conn: &Connection) -> Result<Vec<TagCategory>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, sort_order, created_at FROM tag_categories ORDER BY sort_order",
    )?;
    let rows = stmt.query_map([], row_to_tag_category)?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

fn get_tag_category(conn: &Connection, id: i64) -> Result<TagCategory> {
    conn.query_row(
        "SELECT id, name, sort_order, created_at FROM tag_categories WHERE id = ?1",
        params![id],
        row_to_tag_category,
    )
    .with_context(|| format!("tag category {id} not found"))
}

pub fn create_tag_category(conn: &Connection, input: NewTagCategory) -> Result<TagCategory> {
    let name = input.name.trim();
    let next_sort_order: i64 = conn.query_row(
        "SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tag_categories",
        [],
        |r| r.get(0),
    )?;
    conn.execute(
        "INSERT INTO tag_categories (name, sort_order, created_at) VALUES (?1, ?2, ?3)",
        params![name, next_sort_order, now()],
    )?;
    get_tag_category(conn, conn.last_insert_rowid())
}

pub fn rename_tag_category(conn: &Connection, id: i64, name: &str) -> Result<TagCategory> {
    conn.execute(
        "UPDATE tag_categories SET name = ?1 WHERE id = ?2",
        params![name.trim(), id],
    )?;
    get_tag_category(conn, id)
}

/// Delete a tag category. Tags that belonged to it become uncategorized
/// (`category_id` set to NULL by the `ON DELETE SET NULL` foreign key)
/// rather than being deleted themselves, and snippets are untouched —
/// mirrors `delete_folder`'s un-filing of snippets.
pub fn delete_tag_category(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM tag_categories WHERE id = ?1", params![id])?;
    Ok(())
}

/// Assign `tag_name` to `category_id` (`None` uncategorizes it). No-ops
/// silently if the tag doesn't exist yet (nothing to assign a category to).
pub fn set_tag_category(conn: &Connection, tag_name: &str, category_id: Option<i64>) -> Result<()> {
    conn.execute(
        "UPDATE tags SET category_id = ?1 WHERE name = ?2",
        params![category_id, tag_name],
    )?;
    Ok(())
}

pub fn list_tags_with_categories(conn: &Connection) -> Result<Vec<TagWithCategory>> {
    let mut stmt = conn.prepare("SELECT name, category_id FROM tags ORDER BY name")?;
    let rows = stmt.query_map([], |row| {
        Ok(TagWithCategory {
            name: row.get(0)?,
            category_id: row.get(1)?,
        })
    })?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

fn row_to_folder(row: &rusqlite::Row<'_>) -> rusqlite::Result<Folder> {
    Ok(Folder {
        id: row.get(0)?,
        name: row.get(1)?,
        created_at: row.get(2)?,
    })
}

pub fn list_folders(conn: &Connection) -> Result<Vec<Folder>> {
    let mut stmt = conn.prepare("SELECT id, name, created_at FROM folders ORDER BY name")?;
    let rows = stmt.query_map([], row_to_folder)?;
    rows.map(|r| r.map_err(anyhow::Error::from)).collect()
}

fn get_folder(conn: &Connection, id: i64) -> Result<Folder> {
    conn.query_row(
        "SELECT id, name, created_at FROM folders WHERE id = ?1",
        params![id],
        row_to_folder,
    )
    .with_context(|| format!("folder {id} not found"))
}

pub fn create_folder(conn: &Connection, input: NewFolder) -> Result<Folder> {
    let name = input.name.trim();
    conn.execute(
        "INSERT INTO folders (name, created_at) VALUES (?1, ?2)",
        params![name, now()],
    )?;
    get_folder(conn, conn.last_insert_rowid())
}

pub fn rename_folder(conn: &Connection, id: i64, name: &str) -> Result<Folder> {
    conn.execute(
        "UPDATE folders SET name = ?1 WHERE id = ?2",
        params![name.trim(), id],
    )?;
    get_folder(conn, id)
}

/// Delete a folder. Snippets that belonged to it become unfiled (`folder_id`
/// set to NULL by the `ON DELETE SET NULL` foreign key) rather than being
/// deleted themselves.
pub fn delete_folder(conn: &Connection, id: i64) -> Result<()> {
    conn.execute("DELETE FROM folders WHERE id = ?1", params![id])?;
    Ok(())
}

pub fn set_snippet_folder(conn: &Connection, snippet_id: i64, folder_id: Option<i64>) -> Result<Snippet> {
    conn.execute(
        "UPDATE snippets SET folder_id = ?1, updated_at = MAX(?2, created_at) WHERE id = ?3",
        params![folder_id, now(), snippet_id],
    )?;
    get_snippet(conn, snippet_id)
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

#[derive(Debug, Serialize, Default)]
pub struct MarkdownDirResult {
    pub imported: usize,
    pub overwritten: usize,
    pub skipped: usize,
    pub renamed: usize,
    pub failed_files: usize,
}

impl MarkdownDirResult {
    pub fn add(&mut self, r: &ImportResult) {
        self.imported += r.imported;
        self.overwritten += r.overwritten;
        self.skipped += r.skipped;
        self.renamed += r.renamed;
    }
}

#[derive(Debug, Deserialize)]
struct ImportSnippet {
    /// Present in exports and in Markdown front matter (`uid:`); absent in
    /// hand-written or pre-uid files, which fall back to title matching.
    #[serde(default)]
    uid: Option<String>,
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

pub fn import_vault_json(conn: &Connection, json: &str, strategy: &str) -> Result<ImportResult> {
    let incoming: Vec<ImportSnippet> = match serde_json::from_str::<VaultImport>(json) {
        Ok(v) if !v.snippets.is_empty() => v.snippets,
        _ => serde_json::from_str(json).context("file is not a valid CodeVault export")?,
    };

    // All-or-nothing: a bad record aborts the import with the vault untouched.
    let tx = conn.unchecked_transaction()?;
    let mut run = ImportRun::default();
    for snip in incoming {
        apply_import_strategy(&tx, &snip, strategy, &mut run)?;
    }
    tx.commit()?;
    Ok(run.result)
}

/// Per-import state threaded through `apply_import_strategy`.
#[derive(Default)]
struct ImportRun {
    result: ImportResult,
    /// Rows inserted by *this* import. The identical-snippet rule never
    /// matches these, so two distinct records in one file both survive.
    inserted: HashSet<i64>,
}

/// Insert or merge one incoming snippet and record the outcome on `result`.
/// Shared by JSON and Markdown import so both handle conflicts identically.
///
/// 1. **Same `uid` already in the vault** — it's the *same* snippet, so a
///    copy is never what you want: `overwrite` updates it in place (title
///    included), while `skip` and `rename` leave it untouched (counted as
///    skipped). This is what makes re-importing a pack idempotent.
/// 2. **An identical snippet** already in the vault before this import — every
///    user-editable field matches (title, language, code, description, notes,
///    and the tag set, case-insensitively; `favorite` is local state and
///    ignored) — skipped unless the strategy is `overwrite`. A copy that
///    differs in nothing would be pure duplication.
/// 3. **Otherwise, a title collision** with a different snippet resolves per
///    `strategy`: "skip", "overwrite" (the existing row keeps its own uid),
///    or anything else falls back to "rename" (insert as "Title (2)").
/// 4. **No collision** — insert, keeping the incoming uid if there is one.
///
/// Must be called inside a transaction (the callers own it).
fn apply_import_strategy(
    conn: &Connection,
    snip: &ImportSnippet,
    strategy: &str,
    run: &mut ImportRun,
) -> Result<()> {
    let title = if snip.title.trim().is_empty() {
        "Imported snippet"
    } else {
        snip.title.as_str()
    };
    let uid = snip
        .uid
        .as_deref()
        .filter(|u| !u.trim().is_empty())
        .map(normalize_uid)
        .transpose()
        .with_context(|| format!("snippet {title:?}"))?;

    if let Some(uid) = &uid {
        if let Some(id) = find_id_by_uid(conn, uid)? {
            if strategy == "overwrite" {
                overwrite_snippet(conn, id, snip, title)?;
                run.result.overwritten += 1;
            } else {
                run.result.skipped += 1;
            }
            return Ok(());
        }
    }

    // An identical snippet already exists: a "(2)" copy would be pure
    // duplication. This also covers vaults that imported a pack before it
    // carried uids (their rows got fresh uids in the v4 migration, so the
    // uid match above can't find them).
    if strategy != "overwrite" && has_identical_snippet(conn, title, snip, &run.inserted)? {
        run.result.skipped += 1;
        return Ok(());
    }

    let existing: Option<i64> = match conn.query_row(
        "SELECT id FROM snippets WHERE title = ?1 ORDER BY id LIMIT 1",
        params![title],
        |r| r.get(0),
    ) {
        Ok(id) => Some(id),
        Err(rusqlite::Error::QueryReturnedNoRows) => None,
        Err(err) => return Err(err.into()),
    };

    match (existing, strategy) {
        (Some(_), "skip") => run.result.skipped += 1,
        (Some(id), "overwrite") => {
            overwrite_snippet(conn, id, snip, title)?;
            run.result.overwritten += 1;
        }
        (Some(_), _) => {
            let renamed = unique_title(conn, title)?;
            let id = insert_full(conn, snip, &renamed, uid.as_deref())?;
            run.inserted.insert(id);
            run.result.renamed += 1;
        }
        (None, _) => {
            let id = insert_full(conn, snip, title, uid.as_deref())?;
            run.inserted.insert(id);
            run.result.imported += 1;
        }
    }
    Ok(())
}

/// Tag set for identity comparison: trimmed, non-empty, ASCII-lowercased
/// (matching the `COLLATE NOCASE` on `tags.name`), order and duplicates ignored.
fn tag_key(tags: &[String]) -> BTreeSet<String> {
    tags.iter()
        .map(|t| t.trim().to_ascii_lowercase())
        .filter(|t| !t.is_empty())
        .collect()
}

/// Is there a snippet, not inserted by the current import, whose every
/// user-editable field equals the incoming one? See `apply_import_strategy`.
fn has_identical_snippet(
    conn: &Connection,
    title: &str,
    snip: &ImportSnippet,
    exclude: &HashSet<i64>,
) -> Result<bool> {
    let mut stmt = conn.prepare(
        "SELECT id FROM snippets
         WHERE title = ?1 AND language = ?2 AND code = ?3
           AND description = ?4 AND notes = ?5",
    )?;
    let candidates = stmt
        .query_map(
            params![title, snip.language, snip.code, snip.description, snip.notes],
            |r| r.get::<_, i64>(0),
        )?
        .collect::<rusqlite::Result<Vec<_>>>()?;

    let want = tag_key(&snip.tags);
    for id in candidates {
        if !exclude.contains(&id) && tag_key(&get_snippet(conn, id)?.tags) == want {
            return Ok(true);
        }
    }
    Ok(false)
}

fn insert_full(conn: &Connection, s: &ImportSnippet, title: &str, uid: Option<&str>) -> Result<i64> {
    let created = s.created_at.unwrap_or_else(now);
    // Files from another machine (or hand-edited) can have updated < created;
    // clamp rather than trip the CHECK and abort the whole import.
    let updated = s.updated_at.unwrap_or_else(now).max(created);
    let uid = uid.map(str::to_string).unwrap_or_else(new_uid);
    conn.execute(
        "INSERT INTO snippets (uid, title, description, language, code, notes, favorite, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            uid,
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
    write_snippet_tags(conn, id, &s.tags)?;
    Ok(id)
}

fn overwrite_snippet(conn: &Connection, id: i64, s: &ImportSnippet, title: &str) -> Result<()> {
    conn.execute(
        "UPDATE snippets SET title = ?1, description = ?2, language = ?3, code = ?4,
             notes = ?5, favorite = ?6, updated_at = MAX(?7, created_at) WHERE id = ?8",
        params![
            title,
            s.description,
            s.language,
            s.code,
            s.notes,
            s.favorite as i64,
            s.updated_at.unwrap_or_else(now),
            id
        ],
    )?;
    write_snippet_tags(conn, id, &s.tags)?;
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

/// Import a Markdown file that contains one *or more* snippets, applying the
/// same skip/overwrite/rename conflict `strategy` as [`import_vault_json`].
///
/// Each snippet is delimited by its own front-matter block:
///
/// ```text
/// ---
/// uid: 0190c3a2-7b1e-7c3d-9f4a-2b6e8d1c5a70   (optional; see below)
/// title: My Snippet
/// language: bash
/// tags: linux, cleanup
/// ---
/// the code (optionally wrapped in a ```lang fenced block)
/// ```
///
/// Everything up to the *next* front-matter block (or end of file) becomes
/// that snippet's code; stray `---` horizontal rules between snippets (as
/// produced by many Markdown renderers/editors) are ignored rather than
/// treated as section boundaries. A single fenced code block wrapping the
/// whole body has its fences stripped, and its info-string (e.g. ```bash)
/// is used as a language fallback when `language:` is absent. A file with
/// no recognisable front-matter imports as a single snippet with defaulted
/// title/language, matching the previous single-snippet-only behaviour.
///
/// An optional `uid:` key gives the snippet a stable identity: re-importing
/// the file matches it by uid instead of title, so it is never duplicated
/// (see `apply_import_strategy`). The whole file imports atomically.
pub fn import_markdown(conn: &Connection, content: &str, strategy: &str) -> Result<ImportResult> {
    let blocks = split_markdown_blocks(content);
    let mut run = ImportRun::default();

    // All-or-nothing per file, like JSON import.
    let tx = conn.unchecked_transaction()?;
    if blocks.is_empty() {
        import_markdown_block(&tx, "", content, strategy, &mut run)?;
    } else {
        for (front, body) in blocks {
            import_markdown_block(&tx, &front, &body, strategy, &mut run)?;
        }
    }
    tx.commit()?;
    Ok(run.result)
}

fn import_markdown_block(
    conn: &Connection,
    front: &str,
    body: &str,
    strategy: &str,
    run: &mut ImportRun,
) -> Result<()> {
    let mut uid: Option<String> = None;
    let mut title = String::new();
    let mut language = String::new();
    let mut tags: Vec<String> = vec![];

    for line in front.lines() {
        let Some((key, value)) = line.split_once(':') else {
            continue;
        };
        let value = value.trim().trim_matches(|c| c == '"' || c == '\'');
        match key.trim().to_lowercase().as_str() {
            "uid" => uid = Some(value.to_string()),
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

    let (code, fence_lang) = strip_code_fence(body);
    if language.is_empty() {
        language = fence_lang.unwrap_or_default();
    }

    let snip = ImportSnippet {
        uid,
        title,
        description: String::new(),
        language,
        code,
        notes: String::new(),
        favorite: false,
        tags,
        created_at: None,
        updated_at: None,
    };
    apply_import_strategy(conn, &snip, strategy, run)
}

const FRONT_MATTER_KEYS: [&str; 5] = ["uid", "title", "language", "lang", "tags"];

/// Scan `content` for front-matter blocks (`---` / key: value lines / `---`)
/// and return each one's `(front_matter, body)` pair, where `body` is the
/// text up to the start of the next front-matter block or EOF. A `---` pair
/// only counts as front matter if it contains at least one recognised key;
/// this distinguishes real front matter from a plain `---` horizontal rule.
/// Returns an empty `Vec` if no front-matter block is found at all.
fn split_markdown_blocks(content: &str) -> Vec<(String, String)> {
    let lines: Vec<&str> = content.lines().collect();
    let dash_lines: Vec<usize> = lines
        .iter()
        .enumerate()
        .filter(|(_, l)| l.trim() == "---")
        .map(|(i, _)| i)
        .collect();

    let mut spans: Vec<(usize, usize)> = vec![];
    let mut i = 0;
    while i + 1 < dash_lines.len() {
        let open = dash_lines[i];
        let close = dash_lines[i + 1];
        let is_front_matter = lines[open + 1..close].iter().any(|l| {
            l.split_once(':')
                .map(|(key, _)| FRONT_MATTER_KEYS.contains(&key.trim().to_lowercase().as_str()))
                .unwrap_or(false)
        });
        if is_front_matter {
            spans.push((open, close));
            i += 2;
        } else {
            i += 1;
        }
    }

    spans
        .iter()
        .enumerate()
        .map(|(idx, &(open, close))| {
            let front = lines[open + 1..close].join("\n");
            let body_start = close + 1;
            let body_end = spans.get(idx + 1).map(|&(next_open, _)| next_open).unwrap_or(lines.len());
            let mut body_lines = lines[body_start..body_end].to_vec();
            // Trailing horizontal rules / blank lines belong to the gap
            // between snippets, not to this snippet's code.
            while matches!(body_lines.last(), Some(l) if l.trim().is_empty() || l.trim() == "---") {
                body_lines.pop();
            }
            (front, body_lines.join("\n"))
        })
        .collect()
}

/// If `body` is a single fenced code block (```lang ... ```), return its
/// inner content plus the fence's info-string as a language hint. Anything
/// else (no fence, or extra text alongside the fence) is returned unchanged
/// with no language hint, so non-fenced snippets behave exactly as before.
fn strip_code_fence(body: &str) -> (String, Option<String>) {
    let trimmed = body.trim();
    let mut lines = trimmed.lines();
    let Some(first) = lines.next() else {
        return (String::new(), None);
    };
    let Some(lang) = first.trim().strip_prefix("```") else {
        return (trimmed.to_string(), None);
    };

    let rest: Vec<&str> = lines.collect();
    if rest.last().map(|l| l.trim()) != Some("```") {
        return (trimmed.to_string(), None);
    }

    let inner = rest[..rest.len() - 1].join("\n");
    let lang = lang.trim();
    (
        inner.trim().to_string(),
        if lang.is_empty() { None } else { Some(lang.to_string()) },
    )
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
            folder_id: None,
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
        assert_eq!(all[0].code, "echo hi");
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
        let r = import_markdown(&conn, md, "rename").unwrap();
        assert_eq!(r.imported, 1);
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips.len(), 1);
        assert_eq!(snips[0].title, "Restart Pi-hole");
        assert_eq!(snips[0].language, "bash");
        assert_eq!(snips[0].code, "pihole restartdns");
        assert_eq!(snips[0].tags, vec!["linux".to_string(), "pihole".to_string()]);
    }

    #[test]
    fn markdown_without_front_matter_falls_back() {
        let conn = test_conn();
        let r = import_markdown(&conn, "just some code", "rename").unwrap();
        assert_eq!(r.imported, 1);
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips[0].title, "Imported snippet");
        assert_eq!(snips[0].code, "just some code");
    }

    #[test]
    fn markdown_fenced_code_block_is_unwrapped() {
        let conn = test_conn();
        let md = "---\ntitle: List Pods\n---\n```bash\nkubectl get pods\n```\n";
        let r = import_markdown(&conn, md, "rename").unwrap();
        assert_eq!(r.imported, 1);
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips[0].code, "kubectl get pods");
        // No explicit `language:` field, so it falls back to the fence's info string.
        assert_eq!(snips[0].language, "bash");
    }

    #[test]
    fn markdown_multiple_snippets_are_split_into_separate_entries() {
        let conn = test_conn();
        let md = "\
# Sample snippets

---

---
title: First Snippet
language: bash
tags: linux, cleanup
---
```bash
echo one
```

---

---
title: Second Snippet
language: python
tags: scripting
---
```python
print(\"two\")
```
";
        let r = import_markdown(&conn, md, "rename").unwrap();
        assert_eq!(r.imported, 2);
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips.len(), 2);

        let first = snips.iter().find(|s| s.title == "First Snippet").unwrap();
        assert_eq!(first.language, "bash");
        assert_eq!(first.code, "echo one");
        assert_eq!(first.tags, vec!["linux".to_string(), "cleanup".to_string()]);

        let second = snips.iter().find(|s| s.title == "Second Snippet").unwrap();
        assert_eq!(second.language, "python");
        assert_eq!(second.code, "print(\"two\")");
        assert_eq!(second.tags, vec!["scripting".to_string()]);
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
        assert_eq!(ymd_from_unix(1_609_459_200), (2021, 1, 1));
        assert_eq!(ymd_from_unix(0), (1970, 1, 1));
    }

    #[test]
    fn folder_lifecycle_assigns_and_unassigns_snippets() {
        let conn = test_conn();
        let snip = create_snippet(&conn, sample("One")).unwrap();
        let folder = create_folder(&conn, NewFolder { name: "Bash Scripts".to_string() }).unwrap();
        assert_eq!(folder.name, "Bash Scripts");

        let moved = set_snippet_folder(&conn, snip.id, Some(folder.id)).unwrap();
        assert_eq!(moved.folder_id, Some(folder.id));

        let renamed = rename_folder(&conn, folder.id, "Shell Scripts").unwrap();
        assert_eq!(renamed.name, "Shell Scripts");

        delete_folder(&conn, folder.id).unwrap();
        assert!(list_folders(&conn).unwrap().is_empty());
        let unfiled = get_snippet(&conn, snip.id).unwrap();
        assert_eq!(unfiled.folder_id, None);
    }

    #[test]
    fn tag_category_lifecycle_assigns_and_unassigns_tags() {
        let conn = test_conn();
        create_snippet(&conn, sample("One")).unwrap(); // tagged "shell" by `sample()`
        let category = create_tag_category(&conn, NewTagCategory { name: "Language".to_string() }).unwrap();
        assert_eq!(category.name, "Language");
        assert_eq!(category.sort_order, 0);

        set_tag_category(&conn, "shell", Some(category.id)).unwrap();
        let tags = list_tags_with_categories(&conn).unwrap();
        let shell = tags.iter().find(|t| t.name == "shell").unwrap();
        assert_eq!(shell.category_id, Some(category.id));

        let renamed = rename_tag_category(&conn, category.id, "Languages").unwrap();
        assert_eq!(renamed.name, "Languages");

        delete_tag_category(&conn, category.id).unwrap();
        assert!(list_tag_categories(&conn).unwrap().is_empty());
        let tags = list_tags_with_categories(&conn).unwrap();
        let shell = tags.iter().find(|t| t.name == "shell").unwrap();
        assert_eq!(shell.category_id, None);
    }

    #[test]
    fn set_tag_category_on_unknown_tag_is_a_noop() {
        let conn = test_conn();
        let category = create_tag_category(&conn, NewTagCategory { name: "Tool".to_string() }).unwrap();
        set_tag_category(&conn, "does-not-exist", Some(category.id)).unwrap();
        assert!(list_tags_with_categories(&conn).unwrap().is_empty());
    }

    #[test]
    fn create_tag_category_rejects_duplicate_name() {
        let conn = test_conn();
        create_tag_category(&conn, NewTagCategory { name: "Topic".to_string() }).unwrap();
        let result = create_tag_category(&conn, NewTagCategory { name: "Topic".to_string() });
        assert!(result.is_err());
    }

    // --- v4: stable identity, schema invariants, atomic imports ------------

    fn is_v7(uid: &str) -> bool {
        Uuid::parse_str(uid).map(|u| u.get_version_num() == 7).unwrap_or(false)
    }

    #[test]
    fn created_snippets_get_distinct_v7_uids() {
        let conn = test_conn();
        let a = create_snippet(&conn, sample("A")).unwrap();
        let b = create_snippet(&conn, sample("B")).unwrap();
        assert!(is_v7(&a.uid) && is_v7(&b.uid));
        assert_ne!(a.uid, b.uid);
    }

    const PACK: &str = "---\nuid: 0190c3a2-7b1e-7c3d-9f4a-2b6e8d1c5a70\ntitle: X\nlanguage: bash\n---\necho one\n";

    #[test]
    fn reimporting_markdown_with_uid_does_not_duplicate() {
        let conn = test_conn();
        let first = import_markdown(&conn, PACK, "rename").unwrap();
        assert_eq!(first.imported, 1);
        for strategy in ["rename", "skip"] {
            let again = import_markdown(&conn, PACK, strategy).unwrap();
            assert_eq!((again.imported, again.renamed, again.skipped), (0, 0, 1));
        }
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips.len(), 1);
        assert_eq!(snips[0].uid, "0190c3a2-7b1e-7c3d-9f4a-2b6e8d1c5a70");
    }

    #[test]
    fn reimporting_with_uid_and_overwrite_updates_in_place() {
        let conn = test_conn();
        import_markdown(&conn, PACK, "rename").unwrap();
        // Same uid, renamed and edited in the file (uid in a different case/format).
        let edited = "---\nuid: {0190C3A2-7B1E-7C3D-9F4A-2B6E8D1C5A70}\ntitle: X renamed\n---\necho two\n";
        let r = import_markdown(&conn, edited, "overwrite").unwrap();
        assert_eq!(r.overwritten, 1);
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips.len(), 1);
        assert_eq!(snips[0].title, "X renamed");
        assert_eq!(snips[0].code, "echo two");
        assert_eq!(snips[0].uid, "0190c3a2-7b1e-7c3d-9f4a-2b6e8d1c5a70");
    }

    #[test]
    fn json_reimport_into_same_vault_is_idempotent() {
        let conn = test_conn();
        create_snippet(&conn, sample("One")).unwrap();
        create_snippet(&conn, sample("Two")).unwrap();
        let json = export_json(&conn).unwrap();
        let r = import_vault_json(&conn, &json, "rename").unwrap();
        assert_eq!((r.imported, r.renamed, r.skipped), (0, 0, 2));
        assert_eq!(list_snippets(&conn).unwrap().len(), 2);
    }

    #[test]
    fn export_roundtrip_preserves_uids() {
        let conn = test_conn();
        let a = create_snippet(&conn, sample("One")).unwrap();
        let json = export_json(&conn).unwrap();
        let conn2 = test_conn();
        import_vault_json(&conn2, &json, "rename").unwrap();
        assert_eq!(list_snippets(&conn2).unwrap()[0].uid, a.uid);
    }

    #[test]
    fn uidless_import_still_matches_by_title() {
        let conn = test_conn();
        create_snippet(&conn, sample("Dup")).unwrap();
        let r = import_vault_json(&conn, r#"[{"title":"Dup","code":"x"}]"#, "rename").unwrap();
        assert_eq!(r.renamed, 1);
        let snips = list_snippets(&conn).unwrap();
        assert_eq!(snips.len(), 2);
        assert!(snips.iter().all(|s| is_v7(&s.uid)));
    }

    #[test]
    fn identical_uidless_reimport_is_skipped_not_renamed() {
        let conn = test_conn();
        let md = "---\ntitle: Same\nlanguage: bash\n---\necho same\n";
        import_markdown(&conn, md, "rename").unwrap();
        let r = import_markdown(&conn, md, "rename").unwrap();
        assert_eq!((r.renamed, r.skipped), (0, 1));
        assert_eq!(list_snippets(&conn).unwrap().len(), 1);
    }

    /// A pack imported before it carried uids, then re-imported after it
    /// gained them: the legacy rows have different (migration-minted) uids,
    /// but the content is identical, so nothing is duplicated.
    #[test]
    fn pack_that_gained_uids_does_not_duplicate_pre_uid_import() {
        let conn = test_conn();
        import_markdown(&conn, "---\ntitle: X\nlanguage: bash\n---\necho one\n", "rename").unwrap();
        let r = import_markdown(&conn, PACK, "rename").unwrap();
        assert_eq!((r.renamed, r.skipped), (0, 1));
        assert_eq!(list_snippets(&conn).unwrap().len(), 1);
    }

    /// Codex review on #8: two distinct snippets sharing title/language/code
    /// in one export must both survive an import into an empty vault.
    #[test]
    fn distinct_snippets_sharing_title_and_code_both_import() {
        let conn = test_conn();
        let json = r#"[
            {"uid":"0190c3a2-7b1e-7c3d-9f4a-2b6e8d1c5a71","title":"T","language":"bash","code":"x","notes":"first"},
            {"uid":"0190c3a2-7b1e-7c3d-9f4a-2b6e8d1c5a72","title":"T","language":"bash","code":"x","notes":"second","tags":["k"]}
        ]"#;
        let r = import_vault_json(&conn, json, "rename").unwrap();
        assert_eq!((r.imported, r.renamed, r.skipped), (1, 1, 0));
        let mut notes: Vec<_> = list_snippets(&conn).unwrap().into_iter().map(|s| s.notes).collect();
        notes.sort();
        assert_eq!(notes, vec!["first".to_string(), "second".to_string()]);

        // Re-importing the same export now matches both by uid: no new rows.
        let again = import_vault_json(&conn, json, "rename").unwrap();
        assert_eq!(again.skipped, 2);
        assert_eq!(list_snippets(&conn).unwrap().len(), 2);
    }

    /// Fully identical records (all fields) in one file are still distinct
    /// rows, since neither existed before the import.
    #[test]
    fn fully_identical_records_in_one_file_both_import() {
        let conn = test_conn();
        let json = r#"[{"title":"T","code":"x"},{"title":"T","code":"x"}]"#;
        let r = import_vault_json(&conn, json, "rename").unwrap();
        assert_eq!((r.imported, r.renamed, r.skipped), (1, 1, 0));
    }

    #[test]
    fn existing_snippet_differing_only_in_notes_or_tags_is_not_identical() {
        let conn = test_conn();
        create_snippet(&conn, sample("Dup")).unwrap(); // bash, "echo hi", tag "shell"
        let notes = r#"[{"title":"Dup","language":"bash","code":"echo hi","notes":"n","tags":["shell"]}]"#;
        assert_eq!(import_vault_json(&conn, notes, "rename").unwrap().renamed, 1);
        let tags = r#"[{"title":"Dup","language":"bash","code":"echo hi","tags":["other"]}]"#;
        assert_eq!(import_vault_json(&conn, tags, "rename").unwrap().renamed, 1);
    }

    #[test]
    fn identical_match_ignores_tag_case_order_and_favorite() {
        let conn = test_conn();
        let mut n = sample("Dup");
        n.tags = vec!["Linux".to_string(), "shell".to_string()];
        n.favorite = true;
        create_snippet(&conn, n).unwrap();
        let json = r#"[{"title":"Dup","language":"bash","code":"echo hi","tags":["SHELL","linux"]}]"#;
        let r = import_vault_json(&conn, json, "rename").unwrap();
        assert_eq!((r.renamed, r.skipped), (0, 1));
    }

    #[test]
    fn invalid_uid_aborts_json_import_without_partial_writes() {
        let conn = test_conn();
        let json = r#"[{"title":"Good","code":"a"},{"uid":"not-a-uuid","title":"Bad"}]"#;
        let err = import_vault_json(&conn, json, "rename").unwrap_err();
        assert!(format!("{err:#}").contains("not-a-uuid"));
        assert!(list_snippets(&conn).unwrap().is_empty());
    }

    #[test]
    fn invalid_uid_aborts_markdown_import_without_partial_writes() {
        let conn = test_conn();
        let md = "---\ntitle: Good\n---\na\n\n---\nuid: nope\ntitle: Bad\n---\nb\n";
        assert!(import_markdown(&conn, md, "rename").is_err());
        assert!(list_snippets(&conn).unwrap().is_empty());
    }

    #[test]
    fn import_clamps_updated_before_created() {
        let conn = test_conn();
        let json = r#"[{"title":"T","created_at":2000,"updated_at":1000}]"#;
        import_vault_json(&conn, json, "rename").unwrap();
        let s = &list_snippets(&conn).unwrap()[0];
        assert_eq!((s.created_at, s.updated_at), (2000, 2000));
    }

    #[test]
    fn tag_containing_comma_round_trips() {
        let conn = test_conn();
        let mut n = sample("A");
        n.tags = vec!["a,b".to_string(), "c".to_string()];
        let s = create_snippet(&conn, n).unwrap();
        let mut tags = s.tags.clone();
        tags.sort();
        assert_eq!(tags, vec!["a,b".to_string(), "c".to_string()]);
    }

    #[test]
    fn snippet_without_tags_has_empty_tag_list() {
        let conn = test_conn();
        let mut n = sample("A");
        n.tags = vec![];
        assert!(create_snippet(&conn, n).unwrap().tags.is_empty());
    }

    #[test]
    fn tag_names_are_case_insensitive() {
        let conn = test_conn();
        let mut a = sample("A");
        a.tags = vec!["Linux".to_string()];
        create_snippet(&conn, a).unwrap();
        let mut b = sample("B");
        b.tags = vec!["linux".to_string(), "LINUX".to_string()];
        let b = create_snippet(&conn, b).unwrap();
        assert_eq!(list_tags(&conn).unwrap(), vec!["Linux".to_string()]);
        assert_eq!(b.tags, vec!["Linux".to_string()]);
    }

    #[test]
    fn folder_names_are_unique_case_insensitively() {
        let conn = test_conn();
        create_folder(&conn, NewFolder { name: "Bash".to_string() }).unwrap();
        assert!(create_folder(&conn, NewFolder { name: "bash".to_string() }).is_err());
        assert!(create_folder(&conn, NewFolder { name: "   ".to_string() }).is_err());
    }

    #[test]
    fn moving_snippet_to_unknown_folder_is_rejected() {
        let conn = test_conn();
        let s = create_snippet(&conn, sample("A")).unwrap();
        assert!(set_snippet_folder(&conn, s.id, Some(999)).is_err());
        assert_eq!(get_snippet(&conn, s.id).unwrap().folder_id, None);
    }

    #[test]
    fn blank_title_is_rejected() {
        let conn = test_conn();
        assert!(create_snippet(&conn, sample("   ")).is_err());
        assert!(list_snippets(&conn).unwrap().is_empty());
    }

    #[test]
    fn toggle_favorite_flips_and_reports() {
        let conn = test_conn();
        let s = create_snippet(&conn, sample("A")).unwrap();
        assert!(toggle_favorite(&conn, s.id).unwrap());
        assert!(!toggle_favorite(&conn, s.id).unwrap());
        assert!(toggle_favorite(&conn, 999).is_err());
    }

    /// A vault created by the v3 schema with every kind of bad data the old
    /// schema allowed, upgraded to v4.
    #[test]
    fn v4_migration_repairs_legacy_data() {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute_batch("PRAGMA foreign_keys=ON;").unwrap();
        migrate_to(&conn, 3).unwrap();
        conn.execute_batch(
            "INSERT INTO folders (id, name, created_at) VALUES (1, 'Bash', 1), (2, 'bash', 2);
             INSERT INTO tag_categories (id, name, sort_order, created_at) VALUES (1, 'Topic', 0, 1);
             INSERT INTO tags (id, name, category_id) VALUES
                 (1, 'Linux', 77), (2, 'linux', 1), (3, 'a,b', NULL);
             INSERT INTO snippets (id, title, favorite, folder_id, created_at, updated_at) VALUES
                 (1, '  ',  5, 99, 100, 50),
                 (2, 'Two', 0, 2,  200, 300),
                 (3, 'Gone', 0, NULL, 300, 300);
             INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (1, 1), (1, 2), (1, 3), (2, 2);
             DELETE FROM snippets WHERE id = 3;",
        )
        .unwrap();

        migrate(&conn).unwrap();

        assert_eq!(schema_version(&conn).unwrap(), 4);
        let fk_on: i64 = conn.query_row("PRAGMA foreign_keys", [], |r| r.get(0)).unwrap();
        assert_eq!(fk_on, 1);
        let violations: i64 = conn
            .query_row("SELECT COUNT(*) FROM pragma_foreign_key_check", [], |r| r.get(0))
            .unwrap();
        assert_eq!(violations, 0);

        let one = get_snippet(&conn, 1).unwrap();
        assert_eq!(one.title, "Untitled Snippet");
        assert!(one.favorite);
        assert_eq!(one.folder_id, None, "dangling folder id becomes NULL");
        assert_eq!((one.created_at, one.updated_at), (100, 100));
        let mut tags = one.tags.clone();
        tags.sort();
        assert_eq!(tags, vec!["Linux".to_string(), "a,b".to_string()]);

        let two = get_snippet(&conn, 2).unwrap();
        assert_eq!(two.folder_id, Some(1), "case-duplicate folder merged into oldest");
        assert_eq!(two.tags, vec!["Linux".to_string()]);

        assert_eq!(list_folders(&conn).unwrap().len(), 1);
        let linux = list_tags_with_categories(&conn)
            .unwrap()
            .into_iter()
            .find(|t| t.name == "Linux")
            .unwrap();
        assert_eq!(linux.category_id, Some(1), "keeps the merged twin's valid category");

        assert!(is_v7(&one.uid) && is_v7(&two.uid));
        assert_ne!(one.uid, two.uid);

        // AUTOINCREMENT high-water mark survives: deleted id 3 isn't reused.
        let next = create_snippet(&conn, sample("Next")).unwrap();
        assert_eq!(next.id, 4);
    }

    #[test]
    fn open_db_snapshots_an_existing_vault_before_migrating() {
        let dir = tempfile::tempdir().unwrap();
        let db_path = dir.path().join("vault.db");
        {
            let conn = Connection::open(&db_path).unwrap();
            migrate_to(&conn, 3).unwrap();
            conn.execute(
                "INSERT INTO snippets (title, created_at, updated_at) VALUES ('Old', 1, 1)",
                [],
            )
            .unwrap();
        }

        let conn = open_db(&db_path).unwrap();
        assert_eq!(list_snippets(&conn).unwrap()[0].title, "Old");

        let snapshot = dir.path().join("vault.db.pre-v4");
        let snap = Connection::open(&snapshot).unwrap();
        assert_eq!(schema_version(&snap).unwrap(), 3);
        let n: i64 = snap.query_row("SELECT COUNT(*) FROM snippets", [], |r| r.get(0)).unwrap();
        assert_eq!(n, 1);
    }

    #[test]
    fn open_db_does_not_snapshot_a_fresh_vault() {
        let dir = tempfile::tempdir().unwrap();
        open_db(&dir.path().join("vault.db")).unwrap();
        assert!(!dir.path().join("vault.db.pre-v4").exists());
    }
}
