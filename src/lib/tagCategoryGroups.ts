import type { Snippet, TagCategory } from "./types";

export interface TagCategoryGroup {
  /** `null` is the trailing "Uncategorized" bucket */
  category: TagCategory | null;
  snippets: Snippet[];
}

/**
 * Bucket snippets by the categories of their tags. A snippet appears once in
 * every category any of its tags belongs to; snippets with no tags, or only
 * tags without a category, land in a trailing `null` bucket. Tags missing from
 * `byName` (created since the map was loaded) count as uncategorized.
 *
 * With `sortWithinGroup`, each bucket is ordered by the snippet's
 * alphabetically-first tag in that bucket (then title) so snippets sharing a
 * tag sit together; otherwise the caller's order is kept.
 */
export function groupSnippetsByTagCategory(
  snippets: Snippet[],
  categories: TagCategory[],
  byName: Record<string, number | null>,
  sortWithinGroup: boolean,
): TagCategoryGroup[] {
  const categoryOf = (tag: string) => byName[tag] ?? null;

  const buckets = new Map<number | null, Snippet[]>();
  for (const snippet of snippets) {
    const ids = new Set<number | null>(snippet.tags.map(categoryOf));
    if (ids.size === 0) ids.add(null);
    for (const id of ids) {
      const bucket = buckets.get(id);
      if (bucket) bucket.push(snippet);
      else buckets.set(id, [snippet]);
    }
  }

  const finish = (id: number | null, items: Snippet[]) => {
    if (!sortWithinGroup) return items;
    const key = (s: Snippet) =>
      s.tags.filter((t) => categoryOf(t) === id).sort((a, b) => a.localeCompare(b))[0] ?? "";
    return [...items].sort((a, b) => key(a).localeCompare(key(b)) || a.title.localeCompare(b.title));
  };

  const groups: TagCategoryGroup[] = [];
  for (const category of categories) {
    const items = buckets.get(category.id);
    if (items?.length) groups.push({ category, snippets: finish(category.id, items) });
  }
  const uncategorized = buckets.get(null);
  if (uncategorized?.length) groups.push({ category: null, snippets: finish(null, uncategorized) });
  return groups;
}
