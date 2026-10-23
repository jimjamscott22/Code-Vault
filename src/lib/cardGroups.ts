import type { CardGroupBy, CardSort } from "./settings";
import type { Folder, Snippet } from "./types";

export interface CardGroup {
  key: string;
  /** `null` for the single ungrouped bucket (no header is rendered) */
  label: string | null;
  snippets: Snippet[];
}

const UNFILED_LABEL = "Unfiled";

// Title A–Z with a stable id tiebreak, so equal titles never reshuffle.
function byTitle(a: Snippet, b: Snippet): number {
  return a.title.localeCompare(b.title) || a.id - b.id;
}

function byUpdated(a: Snippet, b: Snippet): number {
  return b.updated_at - a.updated_at || byTitle(a, b);
}

/**
 * Sort already-filtered snippets, then bucket them by folder or language.
 * Every snippet lands in exactly one group; groups are alphabetical with
 * "Unfiled" last, and empty groups are never produced.
 */
export function groupCardSnippets(
  snippets: Snippet[],
  folders: Folder[],
  groupBy: CardGroupBy,
  sort: CardSort,
): CardGroup[] {
  const sorted = [...snippets].sort(sort === "title" ? byTitle : byUpdated);
  if (groupBy === "none") {
    return sorted.length ? [{ key: "all", label: null, snippets: sorted }] : [];
  }

  const folderNames = new Map(folders.map((f) => [f.id, f.name]));
  const buckets = new Map<string, CardGroup>();
  for (const snippet of sorted) {
    let key: string;
    let label: string;
    if (groupBy === "folder") {
      // A dangling folder_id is treated as unfiled rather than dropped.
      const name = snippet.folder_id === null ? undefined : folderNames.get(snippet.folder_id);
      key = name === undefined ? "unfiled" : `folder:${snippet.folder_id}`;
      label = name ?? UNFILED_LABEL;
    } else {
      label = snippet.language || "plain";
      key = `language:${label.toLowerCase()}`;
    }
    const bucket = buckets.get(key);
    if (bucket) bucket.snippets.push(snippet);
    else buckets.set(key, { key, label, snippets: [snippet] });
  }

  return [...buckets.values()].sort((a, b) => {
    if (a.key === "unfiled") return 1;
    if (b.key === "unfiled") return -1;
    return (a.label ?? "").localeCompare(b.label ?? "") || a.key.localeCompare(b.key);
  });
}
