use std::sync::Mutex;

use crate::db::{self, NewSnippet, Snippet, SnippetPatch};
use tauri::State;

pub struct DbState(pub Mutex<rusqlite::Connection>);

type CmdResult<T> = Result<T, String>;

fn e(err: impl std::fmt::Display) -> String {
    err.to_string()
}

#[tauri::command]
pub fn list_snippets(state: State<'_, DbState>) -> CmdResult<Vec<Snippet>> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::list_snippets(&conn).map_err(e)
}

#[tauri::command]
pub fn get_snippet(state: State<'_, DbState>, id: i64) -> CmdResult<Snippet> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::get_snippet(&conn, id).map_err(e)
}

#[tauri::command]
pub fn create_snippet(state: State<'_, DbState>, input: NewSnippet) -> CmdResult<Snippet> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::create_snippet(&conn, input).map_err(e)
}

#[tauri::command]
pub fn update_snippet(
    state: State<'_, DbState>,
    id: i64,
    patch: SnippetPatch,
) -> CmdResult<Snippet> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::update_snippet(&conn, id, patch).map_err(e)
}

#[tauri::command]
pub fn delete_snippet(state: State<'_, DbState>, id: i64) -> CmdResult<()> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::delete_snippet(&conn, id).map_err(e)
}

#[tauri::command]
pub fn toggle_favorite(state: State<'_, DbState>, id: i64) -> CmdResult<bool> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::toggle_favorite(&conn, id).map_err(e)
}

#[tauri::command]
pub fn list_tags(state: State<'_, DbState>) -> CmdResult<Vec<String>> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::list_tags(&conn).map_err(e)
}

#[tauri::command]
pub fn set_snippet_tags(
    state: State<'_, DbState>,
    id: i64,
    tag_names: Vec<String>,
) -> CmdResult<()> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::set_snippet_tags(&conn, id, &tag_names).map_err(e)
}

#[tauri::command]
pub fn search_snippets(state: State<'_, DbState>, query: String) -> CmdResult<Vec<Snippet>> {
    let conn = state.0.lock().map_err(|_| "db lock poisoned")?;
    db::search_snippets(&conn, &query).map_err(e)
}
