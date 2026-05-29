import { useVaultStore } from "../lib/store";
import LanguageBadge from "./LanguageBadge";

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default function SnippetDetail() {
  const snippet = useVaultStore((s) => s.selectedSnippet());

  if (!snippet) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm">
        <span className="text-3xl mb-3">◌</span>
        select a snippet
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code).catch(() => {});
  };

  const updatedDate = new Date(snippet.updated_at * 1000).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-zinc-100 font-mono font-semibold text-base leading-snug truncate">
              {snippet.title}
            </h2>
            {snippet.description && (
              <p className="text-zinc-500 font-mono text-xs mt-0.5 truncate">{snippet.description}</p>
            )}
          </div>
          <button className="text-zinc-400 hover:text-emerald-400 transition-colors flex-shrink-0 mt-0.5">
            <StarIcon filled={snippet.favorite} />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <LanguageBadge language={snippet.language} />
          {snippet.tags.map((tag) => (
            <span key={tag} className="text-xs font-mono text-zinc-500 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          <span className="ml-auto text-xs font-mono text-zinc-600">{updatedDate}</span>
        </div>
      </div>

      {/* Code section */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">code</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-emerald-400 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
          >
            <CopyIcon />
            copy
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="font-mono text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap break-all">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>

      {/* Notes section */}
      {snippet.notes && (
        <div className="flex-shrink-0 border-t border-zinc-800 max-h-48 overflow-auto">
          <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">notes</span>
          </div>
          <div className="px-4 py-3">
            <p className="text-sm text-zinc-400 font-mono leading-relaxed">{snippet.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
