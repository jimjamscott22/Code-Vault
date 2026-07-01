import { useEffect, useRef } from "react";
import { useVaultStore } from "../lib/store";
import SnippetList from "./SnippetList";

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export default function Sidebar() {
  const {
    searchQuery, setSearchQuery,
    activeTag, setActiveTag,
    activeLanguage, setActiveLanguage,
    allTags, snippets, createSnippet,
    setSettingsOpen,
  } = useVaultStore();

  const tags = allTags();
  const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();

  // Ctrl+F (Cmd+F on macOS) focuses the search input
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
      {/* App header + new button */}
      <div className="px-4 py-4 border-b border-zinc-800 flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-emerald-400 font-mono font-bold text-lg tracking-tight">CodeVault</h1>
          <p className="text-zinc-600 font-mono text-xs mt-0.5">terminal memory trap</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors"
            title="Settings"
          >
            <GearIcon />
          </button>
          <button
            onClick={createSnippet}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-emerald-900 border border-emerald-700 text-emerald-300 rounded hover:bg-emerald-800 transition-colors"
            title="New snippet (Ctrl+N)"
          >
            <PlusIcon />
            new
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus-within:border-emerald-700 transition-colors">
          <SearchIcon />
          <input
            ref={searchRef}
            type="text"
            placeholder="search snippets… (Ctrl+F)"
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
      {languages.length > 0 && (
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
      )}

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="px-3 py-3 border-b border-zinc-800 flex-shrink-0 max-h-40 overflow-y-auto">
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
      )}

      {/* Snippet count */}
      <div className="px-4 py-2 border-b border-zinc-800 flex-shrink-0">
        <span className="text-zinc-600 font-mono text-xs">
          {snippets.length} snippet{snippets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Snippet list — takes remaining height */}
      <div className="flex-1 min-h-0">
        <SnippetList />
      </div>
    </div>
  );
}
