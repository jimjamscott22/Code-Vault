/// Re-export everything from the shared core so that `commands.rs` can
/// continue to import from `crate::db` without changes.
pub use codevault_core::*;

use anyhow::{Context, Result};
use rusqlite::Connection;
use tauri::{AppHandle, Manager};

/// Tauri-specific entry point: resolves the platform data directory, opens the
/// DB via the core library, then takes a WAL checkpoint and runs the daily
/// backup. Failures in the backup step are logged but never fatal.
pub fn init_db(app: &AppHandle) -> Result<Connection> {
    let data_dir = app
        .path()
        .app_data_dir()
        .context("failed to resolve app data directory")?;
    std::fs::create_dir_all(&data_dir).context("failed to create app data directory")?;

    let db_path = data_dir.join("vault.db");
    let conn = codevault_core::open_db(&db_path)?;

    let _ = conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);");
    if let Err(err) = codevault_core::backup_db(&data_dir, &db_path) {
        eprintln!("backup skipped: {err}");
    }

    Ok(conn)
}
