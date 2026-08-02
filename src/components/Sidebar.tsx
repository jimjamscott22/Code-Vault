import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { UNFILED, useVaultStore } from "../lib/store";
import type { Folder } from "../lib/types";
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

function FolderIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0v6a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-6m-19.5 0V6A2.25 2.25 0 014.5 3.75h4.372c.516 0 1.01.205 1.375.57l1.756 1.756c.365.365.859.57 1.375.57H19.5A2.25 2.25 0 0121.75 9v3.75" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

function ResizeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
    </svg>
  );
}

interface ResizeHandleProps {
  label: string;
  active: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
}

function ResizeHandle({ label, active, onPointerDown, onKeyDown }: ResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-label={label}
      aria-orientation="horizontal"
      tabIndex={0}
      title={label}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={`group relative z-10 h-2 flex-shrink-0 cursor-row-resize touch-none outline-none transition-colors before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-zinc-800 hover:before:bg-emerald-700 focus-visible:before:bg-emerald-700 ${
        active ? "before:bg-emerald-700" : ""
      }`}
    >
      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 flex h-5 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-500 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${
          active ? "opacity-100 text-emerald-400" : "opacity-0"
        }`}
      >
        <ResizeIcon />
      </span>
    </div>
  );
}

type ResizableSection = "folders" | "tags";

interface SectionHeights {
  folders: number | null;
  tags: number | null;
}

const MIN_FILTER_SECTION_HEIGHT = 72;
const MIN_SNIPPET_SECTION_HEIGHT = 96;
const KEYBOARD_RESIZE_STEP = 12;

interface FolderRowProps {
  folder: Folder;
  active: boolean;
  count: number;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

function FolderRow({ folder, active, count, onSelect, onRename, onDelete }: FolderRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);
  // Guards against double-submit: unmounting the input on Enter fires a
  // synthetic blur from the same stale closure, which would otherwise
  // re-run the commit logic a second time.
  const settledRef = useRef(false);

  const startEditing = () => {
    settledRef.current = false;
    setName(folder.name);
    setEditing(true);
  };

  const commitRename = () => {
    if (settledRef.current) return;
    settledRef.current = true;
    const trimmed = name.trim();
    if (trimmed && trimmed !== folder.name) onRename(trimmed);
    setEditing(false);
  };

  const cancelRename = () => {
    settledRef.current = true;
    setName(folder.name);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitRename}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") cancelRename();
        }}
        className="w-full bg-zinc-800 border border-emerald-700 text-zinc-200 font-mono text-xs rounded px-2 py-1.5 outline-none"
      />
    );
  }

  return (
    <div
      className={`group w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-mono cursor-pointer transition-colors ${
        active ? "bg-emerald-900 text-emerald-200" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
      }`}
      onClick={onSelect}
    >
      <FolderIcon />
      <span className="flex-1 min-w-0 truncate">{folder.name}</span>
      <span className="text-zinc-600 flex-shrink-0">{count}</span>
      <button
        onClick={(e) => { e.stopPropagation(); startEditing(); }}
        className="flex-shrink-0 hidden group-hover:block text-zinc-500 hover:text-zinc-200"
        title="Rename folder"
      >
        <PencilIcon />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="flex-shrink-0 hidden group-hover:block text-zinc-500 hover:text-red-400"
        title="Delete folder"
      >
        <XIcon />
      </button>
    </div>
  );
}

export default function Sidebar() {
  const {
    searchQuery, setSearchQuery,
    activeTag, setActiveTag,
    activeLanguage, setActiveLanguage,
    activeFolder, setActiveFolder,
    folders, createFolder, renameFolder, deleteFolder,
    allTags, snippets, createSnippet,
    setSettingsOpen,
  } = useVaultStore();

  const tags = allTags();
  const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();

  const [addingFolder, setAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [sectionHeights, setSectionHeights] = useState<SectionHeights>({ folders: null, tags: null });
  const [activeResize, setActiveResize] = useState<ResizableSection | null>(null);
  const foldersRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const snippetsRef = useRef<HTMLDivElement>(null);
  const activeResizeCleanupRef = useRef<(() => void) | null>(null);
  // See FolderRow's settledRef: unmounting this input on Enter fires a
  // stale-closure blur that would otherwise double-submit.
  const addFolderSettledRef = useRef(false);

  const openAddFolder = () => {
    addFolderSettledRef.current = false;
    setNewFolderName("");
    setAddingFolder(true);
  };

  const submitNewFolder = () => {
    if (addFolderSettledRef.current) return;
    addFolderSettledRef.current = true;
    const trimmed = newFolderName.trim();
    if (trimmed) createFolder(trimmed);
    setNewFolderName("");
    setAddingFolder(false);
  };

  const cancelNewFolder = () => {
    addFolderSettledRef.current = true;
    setNewFolderName("");
    setAddingFolder(false);
  };

  const unfiledCount = snippets.filter((s) => s.folder_id === null).length;

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

  useEffect(() => () => activeResizeCleanupRef.current?.(), []);

  const getSectionElement = (section: ResizableSection) =>
    section === "folders" ? foldersRef.current : tagsRef.current;

  const updateSectionHeight = (section: ResizableSection, height: number) => {
    setSectionHeights((current) => ({ ...current, [section]: height }));
  };

  const getSectionHeightBounds = (section: ResizableSection) => {
    const sectionElement = getSectionElement(section);
    const snippetsElement = snippetsRef.current;
    if (!sectionElement || !snippetsElement) return null;

    const currentHeight = sectionElement.getBoundingClientRect().height;
    const snippetHeight = snippetsElement.getBoundingClientRect().height;
    return {
      currentHeight,
      maxHeight: Math.max(
        MIN_FILTER_SECTION_HEIGHT,
        currentHeight + snippetHeight - MIN_SNIPPET_SECTION_HEIGHT,
      ),
    };
  };

  const startResize = (section: ResizableSection, event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = getSectionHeightBounds(section);
    if (!bounds) return;

    event.preventDefault();
    activeResizeCleanupRef.current?.();

    const startY = event.clientY;
    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
    setActiveResize(section);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const nextHeight = Math.min(
        bounds.maxHeight,
        Math.max(MIN_FILTER_SECTION_HEIGHT, bounds.currentHeight + moveEvent.clientY - startY),
      );
      updateSectionHeight(section, nextHeight);
    };

    let cleanedUp = false;
    const finishResize = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finishResize);
      window.removeEventListener("pointercancel", finishResize);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      activeResizeCleanupRef.current = null;
      setActiveResize(null);
    };

    activeResizeCleanupRef.current = finishResize;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", finishResize);
    window.addEventListener("pointercancel", finishResize);
  };

  const resizeWithKeyboard = (section: ResizableSection, event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;

    const bounds = getSectionHeightBounds(section);
    if (!bounds) return;

    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const step = event.shiftKey ? KEYBOARD_RESIZE_STEP * 3 : KEYBOARD_RESIZE_STEP;
    updateSectionHeight(
      section,
      Math.min(
        bounds.maxHeight,
        Math.max(MIN_FILTER_SECTION_HEIGHT, bounds.currentHeight + direction * step),
      ),
    );
  };

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

      {/* Folders */}
      <div
        ref={foldersRef}
        style={{
          height: sectionHeights.folders ?? undefined,
          maxHeight: sectionHeights.folders === null ? 192 : undefined,
        }}
        className="px-3 py-3 flex-shrink-0 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Folders</p>
          <button
            onClick={openAddFolder}
            className="text-zinc-500 hover:text-emerald-400 transition-colors"
            title="New folder"
          >
            <PlusIcon />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setActiveFolder(null)}
            className={`w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-colors ${
              activeFolder === null ? "bg-emerald-900 text-emerald-200" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            }`}
          >
            All snippets
          </button>

          {folders.map((f) => (
            <FolderRow
              key={f.id}
              folder={f}
              active={activeFolder === f.id}
              count={snippets.filter((s) => s.folder_id === f.id).length}
              onSelect={() => setActiveFolder(activeFolder === f.id ? null : f.id)}
              onRename={(name) => renameFolder(f.id, name)}
              onDelete={() => deleteFolder(f.id)}
            />
          ))}

          {unfiledCount > 0 && (
            <button
              onClick={() => setActiveFolder(activeFolder === UNFILED ? null : UNFILED)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-colors ${
                activeFolder === UNFILED ? "bg-emerald-900 text-emerald-200" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              Unfiled ({unfiledCount})
            </button>
          )}

          {addingFolder && (
            <input
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={submitNewFolder}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewFolder();
                if (e.key === "Escape") cancelNewFolder();
              }}
              placeholder="folder name"
              className="w-full bg-zinc-800 border border-emerald-700 text-zinc-200 font-mono text-xs rounded px-2 py-1.5 outline-none placeholder-zinc-600 mt-0.5"
            />
          )}
        </div>
      </div>

      <ResizeHandle
        label="Resize folders and snippets"
        active={activeResize === "folders"}
        onPointerDown={(event) => startResize("folders", event)}
        onKeyDown={(event) => resizeWithKeyboard("folders", event)}
      />

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
        <>
          <div
            ref={tagsRef}
            style={{
              height: sectionHeights.tags ?? undefined,
              maxHeight: sectionHeights.tags === null ? 160 : undefined,
            }}
            className="px-3 py-3 flex-shrink-0 overflow-y-auto"
          >
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

          <ResizeHandle
            label="Resize tags and snippets"
            active={activeResize === "tags"}
            onPointerDown={(event) => startResize("tags", event)}
            onKeyDown={(event) => resizeWithKeyboard("tags", event)}
          />
        </>
      )}

      {/* Snippet count */}
      <div className="px-4 py-2 border-b border-zinc-800 flex-shrink-0">
        <span className="text-zinc-600 font-mono text-xs">
          {snippets.length} snippet{snippets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Snippet list — takes remaining height */}
      <div ref={snippetsRef} className="flex-1 min-h-24">
        <SnippetList />
      </div>
    </div>
  );
}
