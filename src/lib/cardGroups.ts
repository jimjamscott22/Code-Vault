import type { CardGroupBy, CardSort } from "./settings";
import { groupSnippetsByTagCategory } from "./tagCategoryGroups";
import type { Folder, Snippet, TagCategory } from "./types";

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
 * Sort already-filtered snippets, then bucket them by folder, language or tag
 * category. Folder and language put every snippet in exactly one group
 * (alphabetical, "Unfiled" last); tag category repeats a snippet in each
 * category its tags belong to (category order, "Uncategorized" last). Empty
 * groups are never produced.
 */
export function groupCardSnippets(
  snippets: Snippet[],
  folders: Folder[],
  groupBy: CardGroupBy,
  sort: CardSort,
  tagCategories: { categories: TagCategory[]; byName: Record<string, number | null> } = { categories: [], byName: {} },
): CardGroup[] {
  const sorted = [...snippets].sort(sort === "title" ? byTitle : byUpdated);
  if (groupBy === "none") {
    return sorted.length ? [{ key: "all", label: null, snippets: sorted }] : [];
  }

  if (groupBy === "tagCategory") {
    return groupSnippetsByTagCategory(sorted, tagCategories.categories, tagCategories.byName, false).map(
      ({ category, snippets: items }) => ({
        key: category ? `category:${category.id}` : "uncategorized",
        label: category?.name ?? "Uncategorized",
        snippets: items,
      }),
    );
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
