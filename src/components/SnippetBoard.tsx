import { useState, type DragEvent } from "react";
import type { Snippet } from "../lib/types";
import { UNFILED, useVaultStore } from "../lib/store";
import { useSettingsStore } from "../lib/settings";
import { getLanguageColors } from "../lib/languageColors";
import LanguageBadge from "./LanguageBadge";

// Column key: a folder id, or the UNFILED sentinel for snippets with no folder.
type ColumnKey = number | typeof UNFILED;

interface Column {
  key: ColumnKey;
  name: string;
  snippets: Snippet[];
}

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

interface CardProps {
  snippet: Snippet;
  selected: boolean;
  onOpen: () => void;
}

function BoardCard({ snippet, selected, onOpen }: CardProps) {
  const color = getLanguageColors(snippet.language).text;

  return (
    <button
      onClick={onOpen}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(snippet.id));
        e.dataTransfer.effectAllowed = "move";
      }}
      title={snippet.title}
      className={`group w-full flex flex-col text-left rounded-md overflow-hidden bg-zinc-900 border transition-colors cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        selected ? "border-emerald-600" : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Language accent stripe: bg-current picks up the language text color */}
      <div className={`h-0.5 w-full flex-shrink-0 bg-current ${color}`} />
      <div className="flex flex-col gap-1.5 p-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`flex-1 min-w-0 font-mono text-sm font-medium leading-snug line-clamp-2 break-words group-hover:brightness-125 ${color}`}
          >
            {snippet.title}
          </h3>
          {snippet.favorite && <StarIcon />}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <LanguageBadge language={snippet.language} />
          {snippet.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-zinc-500 font-mono">
              #{tag}
            </span>
          ))}
          {snippet.tags.length > 2 && (
            <span className="text-xs text-zinc-600 font-mono">+{snippet.tags.length - 2}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// Favorites first, then alphabetical by title.
function sortColumn(items: Snippet[]): Snippet[] {
  return [...items].sort((a, b) => {
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center bg-zinc-950">
      <span className="text-2xl mb-2">◌</span>
      no snippets found
    </div>
  );
}

export default function SnippetBoard() {
  const { folders, snippets, selectedId, selectSnippet, filteredSnippets, moveSnippetToFolder, activeFolder } =
    useVaultStore();
  const setViewMode = useSettingsStore((s) => s.setViewMode);
  const [dragOver, setDragOver] = useState<ColumnKey | null>(null);

  const openCard = (id: number) => {
    selectSnippet(id);
    setViewMode("list");
  };

  // Bucket the filtered snippets by folder. Every folder gets a column (even
  // empty ones) so it can act as a drop target.
  const buckets = new Map<ColumnKey, Snippet[]>();
  for (const s of filteredSnippets()) {
    const key: ColumnKey = s.folder_id ?? UNFILED;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(s);
    else buckets.set(key, [s]);
  }

  const columns: Column[] = [
    { key: UNFILED, name: "Unfiled", snippets: sortColumn(buckets.get(UNFILED) ?? []) },
    ...folders.map((f) => ({ key: f.id, name: f.name, snippets: sortColumn(buckets.get(f.id) ?? []) })),
  ].filter((c) => activeFolder === null || c.key === activeFolder);

  if (folders.length === 0 && columns.every((c) => c.snippets.length === 0)) return <EmptyState />;

  const handleDrop = (e: DragEvent, key: ColumnKey) => {
    e.preventDefault();
    setDragOver(null);
    const id = Number(e.dataTransfer.getData("text/plain"));
    const snippet = snippets.find((s) => s.id === id);
    if (!snippet) return;
    const folderId = key === UNFILED ? null : key;
    if (snippet.folder_id !== folderId) moveSnippetToFolder(id, folderId);
  };

  return (
    <div className="h-full overflow-x-auto bg-zinc-950 p-5 flex gap-4">
      {columns.map((col) => (
        <div
          key={col.key}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (dragOver !== col.key) setDragOver(col.key);
          }}
          onDragLeave={(e) => {
            // Ignore leave events fired when moving between the column's own children.
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragOver(null);
          }}
          onDrop={(e) => handleDrop(e, col.key)}
          className={`w-64 flex-shrink-0 flex flex-col h-full rounded-lg border bg-zinc-900/40 transition-colors ${
            dragOver === col.key ? "border-emerald-600 bg-zinc-900/80" : "border-zinc-800"
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-zinc-800 flex-shrink-0">
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest truncate">{col.name}</span>
            <span className="text-zinc-600 font-mono text-xs">{col.snippets.length}</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2">
            {col.snippets.length === 0 ? (
              <div className="h-16 flex items-center justify-center rounded-md border border-dashed border-zinc-800 text-zinc-600 font-mono text-xs">
                drop here
              </div>
            ) : (
              col.snippets.map((s) => (
                <BoardCard key={s.id} snippet={s} selected={s.id === selectedId} onOpen={() => openCard(s.id)} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
