import type { Snippet } from "../lib/types";
import { useVaultStore } from "../lib/store";
import { useSettingsStore } from "../lib/settings";
import { getLanguageColors } from "../lib/languageColors";

// Hard cap on preview text before rendering; CSS line-clamp decides how much
// of this actually fits on the card. Keeps huge snippets from bloating the DOM.
const PREVIEW_CHARS = 400;

interface CardProps {
  snippet: Snippet;
  selected: boolean;
  onOpen: () => void;
}

function SnippetCard({ snippet, selected, onOpen }: CardProps) {
  const color = getLanguageColors(snippet.language).text;
  const preview = snippet.code.slice(0, PREVIEW_CHARS);

  return (
    <button
      onClick={onOpen}
      title={snippet.title}
      className={`group flex flex-col text-left h-44 rounded-lg overflow-hidden bg-zinc-900 border transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        selected ? "border-emerald-600" : "border-zinc-800 hover:border-zinc-600"
      } ${snippet.favorite ? "ring-1 ring-emerald-800" : ""}`}
    >
      {/* Language accent stripe: bg-current picks up the language text color */}
      <div className={`h-1 w-full flex-shrink-0 bg-current ${color}`} />
      <div className="flex flex-col flex-1 min-h-0 p-3 gap-2">
        <h3
          className={`font-mono font-bold text-base leading-snug line-clamp-2 break-words group-hover:brightness-125 ${color}`}
        >
          {snippet.title}
        </h3>
        <pre className="flex-1 min-h-0 text-xs font-mono leading-relaxed text-zinc-400 whitespace-pre-wrap break-all overflow-hidden line-clamp-6">
          {preview || <span className="text-zinc-600 italic">// empty</span>}
        </pre>
      </div>
    </button>
  );
}

export default function SnippetCards() {
  const { selectedId, selectSnippet, filteredSnippets } = useVaultStore();
  const setViewMode = useSettingsStore((s) => s.setViewMode);
  const snippets = filteredSnippets();

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center bg-zinc-950">
        <span className="text-2xl mb-2">◌</span>
        no snippets found
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 p-5">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {snippets.map((s) => (
          <SnippetCard
            key={s.id}
            snippet={s}
            selected={s.id === selectedId}
            onOpen={() => {
              selectSnippet(s.id);
              setViewMode("list");
            }}
          />
        ))}
      </div>
    </div>
  );
}
