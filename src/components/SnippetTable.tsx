import type { Snippet } from "../lib/types";
import { useVaultStore } from "../lib/store";
import { useSettingsStore, type TableSort, type TableSortKey } from "../lib/settings";
import { getLanguageColors } from "../lib/languageColors";
import { formatDate } from "../lib/date";
import LanguageBadge from "./LanguageBadge";

const MAX_TAGS = 3;

// Keys that read most naturally newest/most-important first when first picked.
const DESC_FIRST: TableSortKey[] = ["favorite", "updated"];

interface ColumnDef {
  label: string;
  sortKey?: TableSortKey;
  width?: string;
}

const COLUMNS: ColumnDef[] = [
  { label: "★", sortKey: "favorite", width: "w-10" },
  { label: "Title", sortKey: "title" },
  { label: "Language", sortKey: "language", width: "w-32" },
  { label: "Tags", width: "w-52" },
  { label: "Folder", sortKey: "folder", width: "w-36" },
  { label: "Updated", sortKey: "updated", width: "w-32" },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 ${filled ? "text-emerald-400" : "text-zinc-700"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function sortSnippets(snippets: Snippet[], sort: TableSort, folderName: Map<number, string>): Snippet[] {
  const folderOf = (s: Snippet) => (s.folder_id === null ? "" : (folderName.get(s.folder_id) ?? ""));
  const compare = (a: Snippet, b: Snippet): number => {
    switch (sort.key) {
      case "favorite":
        return Number(a.favorite) - Number(b.favorite);
      case "title":
        return a.title.localeCompare(b.title);
      case "language":
        return a.language.localeCompare(b.language);
      case "folder":
        return folderOf(a).localeCompare(folderOf(b));
      case "updated":
        return a.updated_at - b.updated_at;
    }
  };
  const sign = sort.dir === "asc" ? 1 : -1;
  // Ties fall back to title A→Z regardless of direction so the order is stable.
  return [...snippets].sort((a, b) => sign * compare(a, b) || a.title.localeCompare(b.title));
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-600 font-mono text-sm p-6 text-center bg-zinc-950">
      <span className="text-2xl mb-2">◌</span>
      no snippets found
    </div>
  );
}

export default function SnippetTable() {
  const { folders, selectedId, selectSnippet, filteredSnippets } = useVaultStore();
  const tableSort = useSettingsStore((s) => s.tableSort);
  const setTableSort = useSettingsStore((s) => s.setTableSort);
  const setViewMode = useSettingsStore((s) => s.setViewMode);

  const snippets = filteredSnippets();
  if (snippets.length === 0) return <EmptyState />;

  const folderName = new Map(folders.map((f) => [f.id, f.name]));
  const rows = sortSnippets(snippets, tableSort, folderName);

  const open = (id: number) => {
    selectSnippet(id);
    setViewMode("list");
  };

  const sortBy = (key: TableSortKey) => {
    if (tableSort.key === key) {
      setTableSort({ key, dir: tableSort.dir === "asc" ? "desc" : "asc" });
    } else {
      setTableSort({ key, dir: DESC_FIRST.includes(key) ? "desc" : "asc" });
    }
  };

  return (
    <div className="h-full overflow-auto bg-zinc-950">
      <table className="w-full table-fixed text-sm font-mono">
        <thead className="sticky top-0 z-10 bg-zinc-900">
          <tr className="border-b border-zinc-800">
            {COLUMNS.map((col) => {
              const active = col.sortKey !== undefined && tableSort.key === col.sortKey;
              return (
                <th
                  key={col.label}
                  scope="col"
                  aria-sort={active ? (tableSort.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={`${col.width ?? ""} px-3 py-2 text-left font-normal text-xs uppercase tracking-widest ${
                    active ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {col.sortKey ? (
                    <button
                      onClick={() => sortBy(col.sortKey!)}
                      className="inline-flex items-center gap-1 uppercase tracking-widest hover:text-zinc-200 transition-colors"
                      title={`Sort by ${col.sortKey}`}
                    >
                      {col.label}
                      {active && <span className="text-emerald-400">{tableSort.dir === "asc" ? "▲" : "▼"}</span>}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const selected = s.id === selectedId;
            const folder = s.folder_id === null ? null : (folderName.get(s.folder_id) ?? null);
            return (
              <tr
                key={s.id}
                tabIndex={0}
                onClick={() => open(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open(s.id);
                  }
                }}
                className={`group border-b border-zinc-800/70 cursor-pointer transition-colors focus:outline-none focus-visible:bg-zinc-800 ${
                  selected ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                }`}
              >
                <td
                  className={`px-3 py-2 border-l-2 ${selected ? "border-l-emerald-500" : "border-l-transparent"}`}
                >
                  <StarIcon filled={s.favorite} />
                </td>
                <td className="px-3 py-2 truncate" title={s.title}>
                  <span
                    className={`${getLanguageColors(s.language).text} ${
                      selected ? "brightness-125 font-medium" : "group-hover:brightness-125"
                    }`}
                  >
                    {s.title}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <LanguageBadge language={s.language} />
                </td>
                <td className="px-3 py-2 truncate text-xs" title={s.tags.map((t) => `#${t}`).join(" ")}>
                  {s.tags.slice(0, MAX_TAGS).map((tag) => (
                    <span key={tag} className="text-zinc-500 mr-2">
                      #{tag}
                    </span>
                  ))}
                  {s.tags.length > MAX_TAGS && <span className="text-zinc-600">+{s.tags.length - MAX_TAGS}</span>}
                </td>
                <td className="px-3 py-2 truncate text-xs text-zinc-400" title={folder ?? "Unfiled"}>
                  {folder ?? <span className="text-zinc-600">—</span>}
                </td>
                <td className="px-3 py-2 text-xs text-zinc-500 whitespace-nowrap">{formatDate(s.updated_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
