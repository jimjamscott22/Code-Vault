import { useVaultStore } from "../lib/store";
import SnippetList from "./SnippetList";

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

export default function Sidebar() {
  const { searchQuery, setSearchQuery, activeTag, setActiveTag, activeLanguage, setActiveLanguage, allTags, snippets } = useVaultStore();
  const tags = allTags();

  const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
      {/* App header */}
      <div className="px-4 py-4 border-b border-zinc-800 flex-shrink-0">
        <h1 className="text-emerald-400 font-mono font-bold text-lg tracking-tight">CodeVault</h1>
        <p className="text-zinc-600 font-mono text-xs mt-0.5">terminal memory trap</p>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus-within:border-emerald-700 transition-colors">
          <SearchIcon />
          <input
            type="text"
            placeholder="search snippets…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-mono text-zinc-200 placeholder-zinc-600 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-zinc-500 hover:text-zinc-300 transition-colors text-xs font-mono">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Language filter */}
      <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
        <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">Language</p>
        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(activeLanguage === lang ? null : lang)}
              className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                activeLanguage === lang
                  ? "bg-emerald-800 text-emerald-200 border border-emerald-600"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filter */}
      <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
        <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">Tags</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                activeTag === tag
                  ? "bg-emerald-800 text-emerald-200 border border-emerald-600"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet list — takes remaining height */}
      <div className="flex-1 min-h-0">
        <SnippetList />
      </div>
    </div>
  );
}
