import { useEffect, useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { api } from "../lib/api";
import { LANGUAGES } from "../lib/languages";
import { useSettingsStore } from "../lib/settings";
import { useVaultStore } from "../lib/store";
import { toast } from "../lib/toast";
import type { ImportStrategy } from "../lib/types";

export default function Settings() {
  const settingsOpen = useVaultStore((s) => s.settingsOpen);
  const setSettingsOpen = useVaultStore((s) => s.setSettingsOpen);
  const loadSnippets = useVaultStore((s) => s.loadSnippets);

  const defaultLanguage = useSettingsStore((s) => s.defaultLanguage);
  const setDefaultLanguage = useSettingsStore((s) => s.setDefaultLanguage);

  const [dataDir, setDataDir] = useState<string>("");
  const [strategy, setStrategy] = useState<ImportStrategy>("rename");
  const [busy, setBusy] = useState(false);

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
      await api.importMarkdown(path);
      await loadSnippets();
      toast.success("Markdown imported");
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
      const r = await api.importMarkdownDir(path);
      await loadSnippets();
      if (r.imported === 0 && r.failed === 0) {
        toast.error("No .md files found in that folder");
      } else {
        toast.success(
          `Imported ${r.imported} Markdown file${r.imported === 1 ? "" : "s"}` +
            (r.failed ? `, ${r.failed} failed` : ""),
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

          {/* Import / export */}
          <Section title="Import / export" hint="Full-vault JSON, a single Markdown file, or a whole folder of Markdown files (front-matter sets title/language/tags).">
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
