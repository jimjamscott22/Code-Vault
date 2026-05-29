import type { Snippet } from "../lib/types";
import { useVaultStore } from "../lib/store";
import LanguageBadge from "./LanguageBadge";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 flex-shrink-0 ${filled ? "text-emerald-400" : "text-zinc-600"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

interface RowProps {
  snippet: Snippet;
  selected: boolean;
  onClick: () => void;
}

function SnippetRow({ snippet, selected, onClick }: RowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 border-b border-zinc-800 transition-colors group ${
        selected
          ? "bg-zinc-800 border-l-2 border-l-emerald-500"
          : "hover:bg-zinc-800/50 border-l-2 border-l-transparent"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className={`text-sm font-mono leading-snug flex-1 min-w-0 truncate ${selected ? "text-zinc-100" : "text-zinc-200 group-hover:text-zinc-100"}`}>
          {snippet.title}
        </span>
        <StarIcon filled={snippet.favorite} />
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
    </button>
  );
}

export default function SnippetList() {
  const { selectedId, selectSnippet, filteredSnippets } = useVaultStore();
  const snippets = filteredSnippets();

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center">
        <span className="text-2xl mb-2">◌</span>
        no snippets found
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {snippets.map((s) => (
        <SnippetRow
          key={s.id}
          snippet={s}
          selected={s.id === selectedId}
          onClick={() => selectSnippet(s.id)}
        />
      ))}
    </div>
  );
}
