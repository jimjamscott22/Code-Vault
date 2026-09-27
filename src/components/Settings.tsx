import { useEffect, useRef, useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { api } from "../lib/api";
import { LANGUAGES } from "../lib/languages";
import { useSettingsStore } from "../lib/settings";
import { useVaultStore } from "../lib/store";
import { toast } from "../lib/toast";
import type { ImportStrategy } from "../lib/types";

function TagCategoryRow({
  name,
  onRename,
  onDelete,
}: {
  name: string;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const settledRef = useRef(false);

  const startEditing = () => {
    settledRef.current = false;
    setValue(name);
    setEditing(true);
  };

  const commitRename = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) onRename(trimmed);
    setEditing(false);
  };

  const cancelRename = () => {
    settledRef.current = true;
    setValue(name);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") cancelRename();
        }}
        className="w-full bg-zinc-800 border border-emerald-700 text-zinc-200 text-xs rounded px-2 py-1.5 outline-none"
      />
    );
  }

  return (
    <div className="group flex items-center gap-2 px-2 py-1.5 rounded text-xs bg-zinc-800/50">
      <span className="flex-1 min-w-0 truncate text-zinc-300">{name}</span>
      <button
        onClick={startEditing}
        className="flex-shrink-0 hidden group-hover:block text-zinc-500 hover:text-zinc-200"
        title="Rename category"
      >
        ✎
      </button>
      <button
        onClick={onDelete}
        className="flex-shrink-0 hidden group-hover:block text-zinc-500 hover:text-red-400"
        title="Delete category"
      >
        ✕
      </button>
    </div>
  );
}

export default function Settings() {
  const settingsOpen = useVaultStore((s) => s.settingsOpen);
  const setSettingsOpen = useVaultStore((s) => s.setSettingsOpen);
  const loadSnippets = useVaultStore((s) => s.loadSnippets);
  const tagCategories = useVaultStore((s) => s.tagCategories);
  const tagCategoryByName = useVaultStore((s) => s.tagCategoryByName);
  const createTagCategory = useVaultStore((s) => s.createTagCategory);
  const renameTagCategory = useVaultStore((s) => s.renameTagCategory);
  const deleteTagCategory = useVaultStore((s) => s.deleteTagCategory);
  const setTagCategory = useVaultStore((s) => s.setTagCategory);
  const allTags = useVaultStore((s) => s.allTags);

  const defaultLanguage = useSettingsStore((s) => s.defaultLanguage);
  const setDefaultLanguage = useSettingsStore((s) => s.setDefaultLanguage);

  const [dataDir, setDataDir] = useState<string>("");
  const [strategy, setStrategy] = useState<ImportStrategy>("rename");
  const [busy, setBusy] = useState(false);

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // See Sidebar's addFolderSettledRef: guards against a double-submit when
  // unmounting this input on Enter fires a stale-closure blur afterward.
  const addCategorySettledRef = useRef(false);

  const openAddCategory = () => {
    addCategorySettledRef.current = false;
    setNewCategoryName("");
    setAddingCategory(true);
  };

  const submitNewCategory = () => {
    if (addCategorySettledRef.current) return;
    addCategorySettledRef.current = true;
    const trimmed = newCategoryName.trim();
    if (trimmed) createTagCategory(trimmed);
    setNewCategoryName("");
    setAddingCategory(false);
  };

  const cancelNewCategory = () => {
    addCategorySettledRef.current = true;
    setNewCategoryName("");
    setAddingCategory(false);
  };

  useEffect(() => {
    if (settingsOpen) {
      api.getDataDir().then(setDataDir).catch(() => setDataDir("(unknown)"));
    }
  }, [settingsOpen]);

  if (!settingsOpen) return null;

  const close = () => setSettingsOpen(false);

  const handleExport = async () => {
    try {
      const path = await save({
        title: "Export vault",
        defaultPath: "codevault-export.json",
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (!path) return;
      setBusy(true);
      await api.exportVault(path);
      toast.success("Vault exported");
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  const handleImportJson = async () => {
    try {
      const path = await open({
        title: "Import vault (JSON)",
        multiple: false,
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (typeof path !== "string") return;
      setBusy(true);
      const r = await api.importVault(path, strategy);
      await loadSnippets();
      toast.success(
        `Imported ${r.imported}, overwrote ${r.overwritten}, renamed ${r.renamed}, skipped ${r.skipped}`,
      );
    } catch (err) {
      toast.error(`Import failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  const handleImportMarkdown = async () => {
    try {
      const path = await open({
        title: "Import Markdown",
        multiple: false,
        filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      });
      if (typeof path !== "string") return;
      setBusy(true);
      const r = await api.importMarkdown(path, strategy);
      await loadSnippets();
      const total = r.imported + r.overwritten + r.renamed;
      toast.success(
        `Imported ${total} snippet${total === 1 ? "" : "s"}` +
          (r.overwritten || r.renamed || r.skipped
            ? ` (overwrote ${r.overwritten}, renamed ${r.renamed}, skipped ${r.skipped})`
            : ""),
      );
    } catch (err) {
      toast.error(`Import failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  const handleImportMarkdownDir = async () => {
    try {
      const path = await open({
        title: "Import Markdown folder",
        directory: true,
        multiple: false,
      });
      if (typeof path !== "string") return;
      setBusy(true);
      const r = await api.importMarkdownDir(path, strategy);
      await loadSnippets();
      const total = r.imported + r.overwritten + r.renamed;
      if (total === 0 && r.skipped === 0 && r.failed_files === 0) {
        toast.error("No .md files found in that folder");
      } else {
        toast.success(
          `Imported ${total} snippet${total === 1 ? "" : "s"}` +
            (r.overwritten || r.renamed || r.skipped
              ? ` (overwrote ${r.overwritten}, renamed ${r.renamed}, skipped ${r.skipped})`
              : "") +
            (r.failed_files ? `, ${r.failed_files} file${r.failed_files === 1 ? "" : "s"} failed` : ""),
        );
      }
    } catch (err) {
      toast.error(`Import failed: ${err}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-lg w-full max-w-lg mx-4 shadow-2xl font-mono max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-zinc-100 font-semibold text-sm">Settings</h2>
          <button
            onClick={close}
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-sm"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* Default language */}
          <Section title="Default language" hint="Used when creating a new snippet.">
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1.5 outline-none focus:border-emerald-700 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Section>

          {/* Tag categories */}
          <Section
            title="Tag categories"
            hint="Group tags into categories (e.g. Language, Tool, Topic) so the snippet list and card view auto-sort into sections by tag. Uncategorized tags fall into their own section."
          >
            <div className="space-y-3">
              {tagCategories.length > 0 && (
                <div className="flex flex-col gap-1">
                  {tagCategories.map((category) => (
                    <TagCategoryRow
                      key={category.id}
                      name={category.name}
                      onRename={(name) => renameTagCategory(category.id, name)}
                      onDelete={() => deleteTagCategory(category.id)}
                    />
                  ))}
                </div>
              )}

              {addingCategory ? (
                <input
                  autoFocus
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onBlur={submitNewCategory}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitNewCategory();
                    if (e.key === "Escape") cancelNewCategory();
                  }}
                  placeholder="category name"
                  className="w-full bg-zinc-800 border border-emerald-700 text-zinc-200 text-xs rounded px-2 py-1.5 outline-none placeholder-zinc-600"
                />
              ) : (
                <Btn onClick={openAddCategory}>+ new category</Btn>
              )}

              {allTags().length > 0 && (
                <div className="pt-2 border-t border-zinc-800 space-y-1.5 max-h-48 overflow-y-auto">
                  {allTags().map((tag) => (
                    <div key={tag} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-zinc-400 truncate">#{tag}</span>
                      <select
                        value={tagCategoryByName[tag] ?? ""}
                        onChange={(e) =>
                          setTagCategory(tag, e.target.value === "" ? null : Number(e.target.value))
                        }
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-1.5 py-1 outline-none focus:border-emerald-700 cursor-pointer flex-shrink-0"
                      >
                        <option value="">Uncategorized</option>
                        {tagCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Import / export */}
          <Section title="Import / export" hint="Full-vault JSON, or Markdown file(s) — each ---title/language/tags--- front-matter block becomes its own snippet, so one file can hold many.">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Btn onClick={handleExport} disabled={busy}>Export vault (JSON)</Btn>
                <Btn onClick={handleImportMarkdown} disabled={busy}>Import Markdown</Btn>
                <Btn onClick={handleImportMarkdownDir} disabled={busy}>Import Markdown folder</Btn>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Btn onClick={handleImportJson} disabled={busy}>Import vault (JSON)</Btn>
                <label className="text-xs text-zinc-500 flex items-center gap-1.5">
                  on conflict
                  <select
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value as ImportStrategy)}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-1.5 py-1 outline-none focus:border-emerald-700 cursor-pointer"
                  >
                    <option value="rename">rename</option>
                    <option value="skip">skip</option>
                    <option value="overwrite">overwrite</option>
                  </select>
                </label>
              </div>
            </div>
          </Section>

          {/* Data location */}
          <Section title="Data location" hint="Your vault.db lives here.">
            <div className="space-y-2">
              <code className="block bg-zinc-950 border border-zinc-800 rounded px-2.5 py-2 text-xs text-zinc-400 break-all">
                {dataDir || "…"}
              </code>
              <Btn
                onClick={() => openPath(dataDir).catch((err) => toast.error(`${err}`))}
                disabled={!dataDir}
              >
                Open data folder
              </Btn>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-zinc-300 text-xs uppercase tracking-widest mb-1">{title}</h3>
      {hint && <p className="text-zinc-600 text-xs mb-2.5">{hint}</p>}
      {children}
    </div>
  );
}

function Btn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-xs px-3 py-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 hover:border-emerald-700 hover:text-emerald-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
