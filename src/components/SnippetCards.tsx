import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Folder, Snippet } from "../lib/types";
import { useVaultStore } from "../lib/store";
import {
  CARD_GROUP_BYS,
  CARD_SORTS,
  useSettingsStore,
  type CardGroupBy,
  type CardSort,
} from "../lib/settings";
import { groupCardSnippets } from "../lib/cardGroups";
import { getLanguageColors } from "../lib/languageColors";
import LanguageBadge from "./LanguageBadge";
import SnippetDetail from "./SnippetDetail";

// Hard cap on preview text before rendering; the visible slice is further
// limited to PREVIEW_LINES. Keeps huge snippets from bloating the DOM.
const PREVIEW_CHARS = 400;
const PREVIEW_LINES = 6;
const MAX_CARD_TAGS = 3;

// Side-by-side layout: the pane only appears next to the grid at this window
// width; below it the editor replaces the grid instead.
const WIDE_BREAKPOINT = 1280;
const DEFAULT_DETAIL_WIDTH = 480;
const MIN_GRID_WIDTH = 480;
const MIN_DETAIL_WIDTH = 360;
const KEYBOARD_RESIZE_STEP = 24;

const GROUP_LABELS: Record<CardGroupBy, string> = {
  none: "None",
  folder: "Folder",
  language: "Language",
  tagCategory: "Tag category",
};
const SORT_LABELS: Record<CardSort, string> = {
  title: "Title (A–Z)",
  updated: "Recently updated",
};

function StarIcon() {
  return (
    <svg
      className="w-4 h-4 text-emerald-400"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0v6a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-6m-19.5 0V6A2.25 2.25 0 014.5 3.75h4.372c.516 0 1.01.205 1.375.57l1.756 1.756c.365.365.859.57 1.375.57H19.5A2.25 2.25 0 0121.75 9v3.75" />
    </svg>
  );
}

/** First few lines of the code, indentation intact, or null when there is none. */
function codePreview(code: string): string | null {
  if (!code.trim()) return null;
  return code.slice(0, PREVIEW_CHARS).split("\n").slice(0, PREVIEW_LINES).join("\n");
}

interface CardProps {
  snippet: Snippet;
  folderName: string | null;
  selected: boolean;
  onOpen: () => void;
}

function SnippetCard({ snippet, folderName, selected, onOpen }: CardProps) {
  const color = getLanguageColors(snippet.language).text;
  const preview = codePreview(snippet.code);
  const description = snippet.description.trim();
  const shownTags = snippet.tags.slice(0, MAX_CARD_TAGS);
  const extraTags = snippet.tags.length - shownTags.length;

  return (
    <button
      onClick={onOpen}
      data-card-id={snippet.id}
      aria-current={selected ? "true" : undefined}
      className={`group flex flex-col text-left rounded-lg overflow-hidden bg-zinc-900 border transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        selected ? "border-emerald-600" : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Language accent stripe: bg-current picks up the language text color */}
      <div className={`h-1 w-full flex-shrink-0 bg-current ${color}`} />
      <div className="flex flex-col flex-1 min-w-0 p-3 gap-2">
        {/* Fixed-height blocks keep the code previews aligned across a row */}
        <div className="flex items-start gap-2 h-11">
          <h3
            className={`flex-1 min-w-0 font-mono font-bold text-base leading-snug line-clamp-2 break-words group-hover:brightness-125 ${color}`}
          >
            {snippet.title || "Untitled Snippet"}
          </h3>
          {snippet.favorite && (
            <span className="flex-shrink-0 mt-0.5" role="img" aria-label="Favorite" title="Favorite">
              <StarIcon />
            </span>
          )}
        </div>
        <p
          className={`h-10 text-xs leading-5 line-clamp-2 break-words ${
            description ? "text-zinc-400" : "text-zinc-600 italic"
          }`}
        >
          {description || "No description"}
        </p>
        <pre className="h-[6.75rem] overflow-hidden rounded bg-zinc-950 px-2 py-1.5 text-[11px] leading-4 font-mono text-zinc-400 whitespace-pre [tab-size:4]">
          {preview ?? <span className="text-zinc-600 italic">Empty snippet</span>}
        </pre>
        <div className="mt-auto pt-1 flex items-center flex-wrap gap-x-2 gap-y-1 min-w-0">
          <LanguageBadge language={snippet.language} />
          <span
            className={`flex items-center gap-1 min-w-0 max-w-[9rem] text-xs font-mono ${
              folderName ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            <FolderIcon />
            <span className="truncate">{folderName ?? "Unfiled"}</span>
          </span>
          {shownTags.map((tag) => (
            <span key={tag} className="max-w-[7rem] truncate text-xs text-zinc-500 font-mono">
              #{tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="text-xs text-zinc-600 font-mono" title={`${extraTags} more tags`}>
              +{extraTags}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center">
      <span className="text-2xl mb-2">◌</span>
      {filtered ? "no snippets match the current filters" : "no snippets yet"}
    </div>
  );
}

const SELECT_CLASS =
  "bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs rounded px-2 py-1 outline-none focus:border-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors cursor-pointer";

interface ToolbarProps {
  shown: number;
  total: number;
  filtersActive: boolean;
}

function CardToolbar({ shown, total, filtersActive }: ToolbarProps) {
  const cardGroupBy = useSettingsStore((s) => s.cardGroupBy);
  const cardSort = useSettingsStore((s) => s.cardSort);
  const setCardGroupBy = useSettingsStore((s) => s.setCardGroupBy);
  const setCardSort = useSettingsStore((s) => s.setCardSort);
  const clearFilters = useVaultStore((s) => s.clearFilters);

  return (
    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 px-5 py-3 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
      <span className="text-xs font-mono text-zinc-500" aria-live="polite">
        {filtersActive ? `${shown} of ${total}` : shown} snippet{(filtersActive ? total : shown) !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-1.5">
        <label htmlFor="card-group-by" className="text-xs font-mono text-zinc-500">
          Group by
        </label>
        <select
          id="card-group-by"
          value={cardGroupBy}
          onChange={(e) => setCardGroupBy(e.target.value as CardGroupBy)}
          className={SELECT_CLASS}
        >
          {CARD_GROUP_BYS.map((g) => (
            <option key={g} value={g}>{GROUP_LABELS[g]}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1.5">
        <label htmlFor="card-sort" className="text-xs font-mono text-zinc-500">
          Sort
        </label>
        <select
          id="card-sort"
          value={cardSort}
          onChange={(e) => setCardSort(e.target.value as CardSort)}
          className={SELECT_CLASS}
        >
          {CARD_SORTS.map((s) => (
            <option key={s} value={s}>{SORT_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <button
        onClick={clearFilters}
        disabled={!filtersActive}
        className="ml-auto text-xs font-mono px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 disabled:opacity-40 disabled:hover:text-zinc-400 disabled:hover:border-zinc-700 disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}

interface ResizeHandleProps {
  width: number;
  min: number;
  max: number;
  active: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
}

function DetailResizeHandle({ width, min, max, active, onPointerDown, onKeyDown }: ResizeHandleProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize snippet detail pane"
      aria-valuenow={Math.round(width)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      title="Resize snippet detail pane (arrow keys)"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={`relative z-10 w-2 flex-shrink-0 cursor-col-resize touch-none outline-none before:absolute before:inset-y-0 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-zinc-800 hover:before:bg-emerald-700 focus-visible:before:bg-emerald-700 focus-visible:before:w-0.5 transition-colors ${
        active ? "before:bg-emerald-700" : ""
      }`}
    />
  );
}

function useWindowWidth(): number {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export default function SnippetCards() {
  const snippets = useVaultStore((s) => s.snippets);
  const folders = useVaultStore((s) => s.folders);
  const tagCategories = useVaultStore((s) => s.tagCategories);
  const tagCategoryByName = useVaultStore((s) => s.tagCategoryByName);
  const selectedId = useVaultStore((s) => s.selectedId);
  const cardDetailOpen = useVaultStore((s) => s.cardDetailOpen);
  const searchQuery = useVaultStore((s) => s.searchQuery);
  const activeTag = useVaultStore((s) => s.activeTag);
  const activeLanguage = useVaultStore((s) => s.activeLanguage);
  const activeFolder = useVaultStore((s) => s.activeFolder);
  const filteredSnippets = useVaultStore((s) => s.filteredSnippets);
  const openCardDetail = useVaultStore((s) => s.openCardDetail);
  const closeCardDetail = useVaultStore((s) => s.closeCardDetail);
  const cardGroupBy = useSettingsStore((s) => s.cardGroupBy);
  const cardSort = useSettingsStore((s) => s.cardSort);

  const wide = useWindowWidth() >= WIDE_BREAKPOINT;
  const sideBySide = cardDetailOpen && wide;
  // Narrow windows swap the grid for the editor; the grid stays mounted (hidden)
  // so its scroll position and the opener's focus target survive.
  const gridHidden = cardDetailOpen && !wide;

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paneButtonRef = useRef<HTMLButtonElement>(null);
  const scrollTopRef = useRef(0);
  const lastOpenedRef = useRef<number | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [detailWidth, setDetailWidth] = useState(DEFAULT_DETAIL_WIDTH);
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const observer = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Leaving card view starts the next visit with the pane closed.
  useEffect(() => () => {
    resizeCleanupRef.current?.();
    useVaultStore.getState().closeCardDetail();
  }, []);

  const maxDetailWidth = Math.max(MIN_DETAIL_WIDTH, containerWidth - MIN_GRID_WIDTH);
  const effectiveDetailWidth = Math.min(maxDetailWidth, Math.max(MIN_DETAIL_WIDTH, detailWidth));

  const filtersActive = Boolean(searchQuery) || activeTag !== null || activeLanguage !== null || activeFolder !== null;

  // Filters first, then group + sort. The store getter reads current state, so
  // the filter inputs are listed as deps to recompute when any of them change.
  const results = useMemo(
    () => filteredSnippets(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredSnippets, snippets, searchQuery, activeTag, activeLanguage, activeFolder],
  );
  const groups = useMemo(
    () => groupCardSnippets(results, folders, cardGroupBy, cardSort, { categories: tagCategories, byName: tagCategoryByName }),
    [results, folders, cardGroupBy, cardSort, tagCategories, tagCategoryByName],
  );
  const folderNames = useMemo(() => new Map<number, string>(folders.map((f: Folder) => [f.id, f.name])), [folders]);

  // Remember the scroll offset while the grid is visible, and put it back when
  // it returns from behind the narrow-window editor.
  const onGridScroll = () => {
    const el = gridRef.current;
    if (el && el.offsetParent !== null) scrollTopRef.current = el.scrollTop;
  };
  useLayoutEffect(() => {
    if (!gridHidden && gridRef.current) gridRef.current.scrollTop = scrollTopRef.current;
  }, [gridHidden]);

  // Keyboard users land in the pane after opening a card, and back on the card
  // they opened after closing it.
  useEffect(() => {
    if (cardDetailOpen) {
      paneButtonRef.current?.focus();
      return;
    }
    const id = lastOpenedRef.current;
    if (id === null) return;
    lastOpenedRef.current = null;
    gridRef.current?.querySelector<HTMLElement>(`[data-card-id="${id}"]`)?.focus();
  }, [cardDetailOpen]);

  const openCard = (id: number) => {
    lastOpenedRef.current = id;
    openCardDetail(id);
  };

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    resizeCleanupRef.current?.();

    const startX = event.clientX;
    const startWidth = effectiveDetailWidth;
    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    setResizing(true);

    // The pane sits on the right, so dragging left widens it.
    const onPointerMove = (e: PointerEvent) => {
      const next = startWidth + (startX - e.clientX);
      setDetailWidth(Math.min(maxDetailWidth, Math.max(MIN_DETAIL_WIDTH, next)));
    };
    let cleanedUp = false;
    const finish = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      resizeCleanupRef.current = null;
      setResizing(false);
    };
    resizeCleanupRef.current = finish;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  const resizeWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEYBOARD_RESIZE_STEP * 3 : KEYBOARD_RESIZE_STEP;
    let next: number;
    if (event.key === "ArrowLeft") next = effectiveDetailWidth + step;
    else if (event.key === "ArrowRight") next = effectiveDetailWidth - step;
    else if (event.key === "Home") next = MIN_DETAIL_WIDTH;
    else if (event.key === "End") next = maxDetailWidth;
    else return;
    event.preventDefault();
    setDetailWidth(Math.min(maxDetailWidth, Math.max(MIN_DETAIL_WIDTH, next)));
  };

  return (
    <div ref={containerRef} className="flex h-full bg-zinc-950">
      <div className={gridHidden ? "hidden" : "flex flex-col flex-1 min-w-0 h-full"}>
        <CardToolbar shown={results.length} total={snippets.length} filtersActive={filtersActive} />
        {groups.length === 0 ? (
          <EmptyState filtered={filtersActive} />
        ) : (
          <div ref={gridRef} onScroll={onGridScroll} className="flex-1 min-h-0 overflow-y-auto p-5 space-y-6">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={group.label ? `card-group-${group.key}` : undefined}>
                {group.label !== null && (
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <h2
                      id={`card-group-${group.key}`}
                      className="text-zinc-500 font-mono text-xs uppercase tracking-widest"
                    >
                      {group.label}
                    </h2>
                    <span className="text-zinc-600 font-mono text-xs">{group.snippets.length}</span>
                  </div>
                )}
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
                  {group.snippets.map((s) => (
                    <SnippetCard
                      key={s.id}
                      snippet={s}
                      folderName={s.folder_id === null ? null : (folderNames.get(s.folder_id) ?? null)}
                      selected={cardDetailOpen && s.id === selectedId}
                      onOpen={() => openCard(s.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {sideBySide && (
        <DetailResizeHandle
          width={effectiveDetailWidth}
          min={MIN_DETAIL_WIDTH}
          max={maxDetailWidth}
          active={resizing}
          onPointerDown={startResize}
          onKeyDown={resizeWithKeyboard}
        />
      )}

      {cardDetailOpen && (
        <div
          style={sideBySide ? { width: effectiveDetailWidth } : undefined}
          className={`flex flex-col h-full min-w-0 ${sideBySide ? "flex-shrink-0" : "flex-1"}`}
        >
          <div className="flex items-center px-4 py-2 border-b border-zinc-800 bg-zinc-900 flex-shrink-0">
            <button
              ref={paneButtonRef}
              onClick={closeCardDetail}
              aria-label={wide ? "Close snippet detail" : "Back to snippets"}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-100 px-2 py-1 -ml-2 rounded hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
            >
              {wide ? "✕ Close" : "← Back to snippets"}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <SnippetDetail />
          </div>
        </div>
      )}
    </div>
  );
}
