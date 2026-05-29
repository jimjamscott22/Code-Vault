import { useEffect, useRef, useState } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useVaultStore } from "../lib/store";
import type { Snippet } from "../lib/types";
import CodeEditor from "./CodeEditor";
import LanguageBadge from "./LanguageBadge";

// ---------------------------------------------------------------------------
// Inline icons
// ---------------------------------------------------------------------------

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? "text-emerald-400" : "text-zinc-500"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Languages list for the select
// ---------------------------------------------------------------------------

const LANGUAGES = [
  "bash", "css", "html", "javascript", "json", "markdown",
  "nginx", "python", "rust", "sql", "toml", "typescript", "yaml",
];

// ---------------------------------------------------------------------------
// Form state helpers
// ---------------------------------------------------------------------------

interface FormState {
  title: string;
  description: string;
  language: string;
  code: string;
  notes: string;
  tagInput: string;
}

function snippetToForm(s: Snippet): FormState {
  return {
    title: s.title,
    description: s.description,
    language: s.language,
    code: s.code,
    notes: s.notes,
    tagInput: s.tags.join(", "),
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SnippetDetail() {
  const snippet = useVaultStore((s) => s.selectedSnippet());
  const { updateSnippet, updateTags, toggleFavorite, confirmDelete } = useVaultStore();

  const [form, setForm] = useState<FormState | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const snippetIdRef = useRef<number | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reinitialise local form whenever the selected snippet changes
  useEffect(() => {
    if (!snippet) { setForm(null); return; }
    if (snippet.id !== snippetIdRef.current) {
      snippetIdRef.current = snippet.id;
      setForm(snippetToForm(snippet));
      setIsDirty(false);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    }
  }, [snippet]);

  // Debounced autosave (500 ms after last keypress)
  useEffect(() => {
    if (!isDirty || !snippet || !form) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      updateSnippet(snippet.id, {
        title: form.title,
        description: form.description,
        language: form.language,
        code: form.code,
        notes: form.notes,
      });
      setIsDirty(false);
    }, 500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isDirty]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
    setIsDirty(true);
  };

  // Commit tags on blur of the tag input
  const handleTagBlur = () => {
    if (!snippet || !form) return;
    const tags = form.tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateTags(snippet.id, tags);
  };

  const handleCopy = () => {
    if (!form) return;
    writeText(form.code).catch(() => {});
  };

  if (!snippet || !form) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm">
        <span className="text-3xl mb-3">◌</span>
        select a snippet
      </div>
    );
  }

  const updatedDate = new Date(snippet.updated_at * 1000).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex-shrink-0 space-y-3">
        {/* Title row */}
        <div className="flex items-center gap-2">
          <input
            className="flex-1 min-w-0 bg-transparent text-zinc-100 font-mono font-semibold text-base outline-none border-b border-transparent focus:border-zinc-600 transition-colors placeholder-zinc-600"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Untitled Snippet"
          />
          <button
            onClick={() => toggleFavorite(snippet.id)}
            className="flex-shrink-0 hover:text-emerald-400 transition-colors"
            title="Toggle favourite"
          >
            <StarIcon filled={snippet.favorite} />
          </button>
          <button
            onClick={() => confirmDelete(snippet.id)}
            className="flex-shrink-0 text-zinc-500 hover:text-red-400 transition-colors"
            title="Delete snippet"
          >
            <TrashIcon />
          </button>
        </div>

        {/* Description */}
        <input
          className="w-full bg-transparent text-zinc-500 font-mono text-xs outline-none border-b border-transparent focus:border-zinc-700 transition-colors placeholder-zinc-700"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Short description…"
        />

        {/* Language + tags + date */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs rounded px-2 py-1 outline-none focus:border-emerald-700 transition-colors cursor-pointer"
            value={form.language}
            onChange={(e) => handleChange("language", e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <LanguageBadge language={form.language} />

          <input
            className="flex-1 min-w-0 bg-transparent text-zinc-500 font-mono text-xs outline-none border-b border-transparent focus:border-zinc-700 transition-colors placeholder-zinc-700"
            value={form.tagInput}
            onChange={(e) => handleChange("tagInput", e.target.value)}
            onBlur={handleTagBlur}
            placeholder="tags, comma, separated"
          />

          <span className="ml-auto text-xs font-mono text-zinc-600 flex-shrink-0">{updatedDate}</span>
        </div>
      </div>

      {/* Code section */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">code</span>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs font-mono text-zinc-600">saving…</span>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
            >
              <CopyIcon />
              copy
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto">
          <CodeEditor
            value={form.code}
            onChange={(v) => handleChange("code", v)}
            language={form.language}
            placeholder="// paste or type your snippet here"
          />
        </div>
      </div>

      {/* Notes section */}
      <div className="flex-shrink-0 border-t border-zinc-800 h-40 flex flex-col">
        <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">notes</span>
        </div>
        <div className="flex-1 overflow-auto">
          <CodeEditor
            value={form.notes}
            onChange={(v) => handleChange("notes", v)}
            language="markdown"
            placeholder="markdown notes…"
          />
        </div>
      </div>
    </div>
  );
}
