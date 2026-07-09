use anyhow::{Context, Result};
use clap::{Parser, Subcommand};
use codevault_core::{
    create_snippet, delete_snippet, export_json, get_snippet, import_markdown,
    import_vault_json, list_snippets, open_db, search_snippets, NewSnippet, Snippet,
};
use std::path::PathBuf;

// The Tauri bundle identifier determines the data-directory name on all
// platforms — must match `identifier` in tauri.conf.json.
const APP_ID: &str = "dev.codevault.app";

// ---------------------------------------------------------------------------
// CLI definition
// ---------------------------------------------------------------------------

#[derive(Parser)]
#[command(
    name = "codevault",
    about = "CodeVault — your local snippet vault",
    long_about = "Read and write the CodeVault SQLite database from the terminal.\n\
                  By default the same DB used by the desktop app is opened.\n\
                  Override with --db or the CODEVAULT_DB environment variable."
)]
struct Cli {
    /// Path to vault.db (default: auto-detected from platform data dir)
    #[arg(long, env = "CODEVAULT_DB", global = true, value_name = "PATH")]
    db: Option<PathBuf>,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// List all snippets
    List {
        /// Show only snippets with this tag
        #[arg(short, long, value_name = "TAG")]
        tag: Option<String>,
        /// Show only snippets in this language
        #[arg(short, long, value_name = "LANG")]
        lang: Option<String>,
        /// Show favourites only
        #[arg(short, long)]
        fav: bool,
    },
    /// Search snippets by title, code, notes, or tags
    Search {
        /// Query string
        query: String,
    },
    /// Show the full content of a snippet
    Get {
        /// Snippet ID
        id: i64,
    },
    /// Add a new snippet (reads code from --file or stdin)
    Add {
        /// Snippet title
        #[arg(short, long)]
        title: String,
        /// Language identifier (e.g. bash, python, rust)
        #[arg(short, long, default_value = "bash")]
        lang: String,
        /// Comma-separated tags
        #[arg(long, value_name = "TAG,…")]
        tags: Option<String>,
        /// Read code from a file instead of stdin
        #[arg(short, long, value_name = "PATH")]
        file: Option<PathBuf>,
        /// Inline code string (alternative to --file / stdin)
        #[arg(short, long, value_name = "CODE")]
        code: Option<String>,
    },
    /// Delete a snippet by ID
    Delete {
        /// Snippet ID
        id: i64,
        /// Skip confirmation prompt
        #[arg(short, long)]
        yes: bool,
    },
    /// Copy a snippet's code to the system clipboard
    Copy {
        /// Snippet ID
        id: i64,
    },
    /// Import snippets from a JSON vault export or a Markdown file
    Import {
        /// JSON export or Markdown file to import
        file: PathBuf,
        /// Conflict resolution strategy [rename | skip | overwrite]
        #[arg(long, default_value = "rename", value_name = "STRATEGY")]
        strategy: String,
    },
    /// Export the entire vault to a JSON file
    Export {
        /// Destination file path
        file: PathBuf,
    },
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

fn main() -> Result<()> {
    let cli = Cli::parse();

    let db_path = resolve_db_path(cli.db)?;
    if let Some(parent) = db_path.parent() {
        std::fs::create_dir_all(parent)
            .with_context(|| format!("could not create data dir {}", parent.display()))?;
    }
    let conn = open_db(&db_path)
        .with_context(|| format!("could not open database at {}", db_path.display()))?;

    match cli.command {
        Commands::List { tag, lang, fav } => cmd_list(&conn, tag, lang, fav),
        Commands::Search { query } => cmd_search(&conn, &query),
        Commands::Get { id } => cmd_get(&conn, id),
        Commands::Add { title, lang, tags, file, code } => {
            cmd_add(&conn, title, lang, tags, file, code)
        }
        Commands::Delete { id, yes } => cmd_delete(&conn, id, yes),
        Commands::Copy { id } => cmd_copy(&conn, id),
        Commands::Import { file, strategy } => cmd_import(&conn, file, &strategy),
        Commands::Export { file } => cmd_export(&conn, file),
    }
}

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

fn resolve_db_path(override_path: Option<PathBuf>) -> Result<PathBuf> {
    if let Some(p) = override_path {
        return Ok(p);
    }
    let data_dir = dirs::data_local_dir()
        .context("could not determine platform data directory ($XDG_DATA_HOME / %LOCALAPPDATA%)")?;
    Ok(data_dir.join(APP_ID).join("vault.db"))
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

fn cmd_list(
    conn: &rusqlite::Connection,
    tag: Option<String>,
    lang: Option<String>,
    fav: bool,
) -> Result<()> {
    let all = list_snippets(conn)?;
    let filtered: Vec<&Snippet> = all
        .iter()
        .filter(|s| {
            if fav && !s.favorite {
                return false;
            }
            if let Some(ref t) = tag {
                if !s.tags.iter().any(|st| st.eq_ignore_ascii_case(t)) {
                    return false;
                }
            }
            if let Some(ref l) = lang {
                if !s.language.eq_ignore_ascii_case(l) {
                    return false;
                }
            }
            true
        })
        .collect();

    print_table(&filtered);
    Ok(())
}

fn cmd_search(conn: &rusqlite::Connection, query: &str) -> Result<()> {
    let results = search_snippets(conn, query)?;
    let refs: Vec<&Snippet> = results.iter().collect();
    print_table(&refs);
    Ok(())
}

fn cmd_get(conn: &rusqlite::Connection, id: i64) -> Result<()> {
    let s = get_snippet(conn, id)?;

    println!("Title    : {}", s.title);
    println!("ID       : {}", s.id);
    println!("Language : {}", s.language);
    println!("Tags     : {}", s.tags.join(", "));
    println!("Favourite: {}", if s.favorite { "yes" } else { "no" });
    if !s.description.is_empty() {
        println!("Desc     : {}", s.description);
    }
    println!();
    println!("{}", s.code);
    if !s.notes.is_empty() {
        println!();
        println!("--- notes ---");
        println!("{}", s.notes);
    }
    Ok(())
}

fn cmd_add(
    conn: &rusqlite::Connection,
    title: String,
    lang: String,
    tags: Option<String>,
    file: Option<PathBuf>,
    inline_code: Option<String>,
) -> Result<()> {
    let code = if let Some(c) = inline_code {
        c
    } else if let Some(path) = file {
        std::fs::read_to_string(&path)
            .with_context(|| format!("could not read {}", path.display()))?
    } else {
        use std::io::Read;
        let mut buf = String::new();
        std::io::stdin()
            .read_to_string(&mut buf)
            .context("could not read from stdin")?;
        buf
    };

    let tag_list: Vec<String> = tags
        .unwrap_or_default()
        .split(',')
        .map(|t| t.trim().to_string())
        .filter(|t| !t.is_empty())
        .collect();

    let snippet = create_snippet(
        conn,
        NewSnippet {
            title,
            description: String::new(),
            language: lang,
            code,
            notes: String::new(),
            favorite: false,
            tags: tag_list,
            folder_id: None,
        },
    )?;

    println!("Added snippet #{}: {}", snippet.id, snippet.title);
    Ok(())
}

fn cmd_delete(conn: &rusqlite::Connection, id: i64, yes: bool) -> Result<()> {
    let s = get_snippet(conn, id)?;
    if !yes {
        use std::io::Write;
        print!("Delete \"{}\" (id: {})? [y/N] ", s.title, s.id);
        std::io::stdout().flush()?;
        let mut input = String::new();
        std::io::stdin().read_line(&mut input)?;
        if !input.trim().eq_ignore_ascii_case("y") {
            println!("Aborted.");
            return Ok(());
        }
    }
    delete_snippet(conn, id)?;
    println!("Deleted snippet #{}: {}", id, s.title);
    Ok(())
}

fn cmd_copy(conn: &rusqlite::Connection, id: i64) -> Result<()> {
    let s = get_snippet(conn, id)?;
    let mut clipboard = arboard::Clipboard::new()
        .context("failed to open clipboard (is a display server / $DISPLAY / $WAYLAND_DISPLAY set?)")?;
    clipboard
        .set_text(s.code.clone())
        .context("failed to write to clipboard")?;
    println!("Copied to clipboard: \"{}\" (id: {})", s.title, s.id);
    Ok(())
}

fn cmd_import(conn: &rusqlite::Connection, file: PathBuf, strategy: &str) -> Result<()> {
    let ext = file
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();

    let content = std::fs::read_to_string(&file)
        .with_context(|| format!("could not read {}", file.display()))?;

    if ext == "md" || ext == "markdown" {
        let r = import_markdown(conn, &content, strategy)?;
        println!(
            "Imported {}, overwrote {}, renamed {}, skipped {}",
            r.imported, r.overwritten, r.renamed, r.skipped
        );
    } else {
        let r = import_vault_json(conn, &content, strategy)?;
        println!(
            "Imported {}, overwrote {}, renamed {}, skipped {}",
            r.imported, r.overwritten, r.renamed, r.skipped
        );
    }
    Ok(())
}

fn cmd_export(conn: &rusqlite::Connection, file: PathBuf) -> Result<()> {
    let json = export_json(conn)?;
    std::fs::write(&file, &json)
        .with_context(|| format!("could not write to {}", file.display()))?;
    let count = list_snippets(conn)?.len();
    println!("Exported {} snippet(s) to {}", count, file.display());
    Ok(())
}

// ---------------------------------------------------------------------------
// Table display
// ---------------------------------------------------------------------------

fn print_table(snippets: &[&Snippet]) {
    if snippets.is_empty() {
        println!("No snippets found.");
        return;
    }

    let w_lang = snippets
        .iter()
        .map(|s| s.language.len())
        .max()
        .unwrap_or(0)
        .max(4);
    let w_tags = snippets
        .iter()
        .map(|s| s.tags.join(", ").len())
        .max()
        .unwrap_or(0)
        .max(4)
        .min(28);

    println!(
        " {:>4}  {:<wl$}  {:<wt$}  TITLE",
        "ID",
        "LANG",
        "TAGS",
        wl = w_lang,
        wt = w_tags,
    );
    println!(
        " {}  {}  {}  {}",
        "─".repeat(4),
        "─".repeat(w_lang),
        "─".repeat(w_tags),
        "─".repeat(45),
    );

    for s in snippets {
        let fav = if s.favorite { "★ " } else { "  " };
        let tags_str = s.tags.join(", ");
        let tags_display = truncate(&tags_str, w_tags);
        let title_display = truncate(&s.title, 45);
        println!(
            " {:>4}  {:<wl$}  {:<wt$}  {}{}",
            s.id,
            s.language,
            tags_display,
            fav,
            title_display,
            wl = w_lang,
            wt = w_tags,
        );
    }
}

/// Truncate a string to at most `max` Unicode scalar values, appending `…` if
/// truncated.
fn truncate(s: &str, max: usize) -> String {
    let chars: Vec<char> = s.chars().collect();
    if chars.len() <= max {
        s.to_string()
    } else {
        let truncated: String = chars[..max.saturating_sub(1)].iter().collect();
        format!("{truncated}…")
    }
}
