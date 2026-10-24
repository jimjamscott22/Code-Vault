import { describe, expect, it } from "vitest";
import { groupCardSnippets } from "./cardGroups";
import type { Snippet, TagCategory } from "./types";

function snip(id: number, title: string, tags: string[], updated_at = 0): Snippet {
  return {
    id,
    title,
    description: "",
    language: "bash",
    code: "",
    notes: "",
    favorite: false,
    tags,
    folder_id: null,
    created_at: 0,
    updated_at,
  };
}

const lang: TagCategory = { id: 1, name: "Language", sort_order: 0, created_at: 0 };
const tool: TagCategory = { id: 2, name: "Tool", sort_order: 1, created_at: 0 };

describe("groupCardSnippets by tag category", () => {
  const tagCategories = { categories: [lang, tool], byName: { python: 1, cli: 2 } as Record<string, number | null> };

  it("sections cards by category with Uncategorized last, labelled for the headers", () => {
    const groups = groupCardSnippets(
      [snip(1, "a", ["cli"]), snip(2, "b", ["python"]), snip(3, "c", ["misc"]), snip(4, "d", [])],
      [],
      "tagCategory",
      "title",
      tagCategories,
    );
    expect(groups.map((g) => g.label)).toEqual(["Language", "Tool", "Uncategorized"]);
    expect(groups[2].snippets.map((s) => s.title)).toEqual(["c", "d"]);
  });

  it("repeats a multi-category snippet in each of its sections", () => {
    const groups = groupCardSnippets([snip(1, "both", ["python", "cli"])], [], "tagCategory", "title", tagCategories);
    expect(groups.map((g) => g.label)).toEqual(["Language", "Tool"]);
    expect(new Set(groups.map((g) => g.key)).size).toBe(2);
  });

  it("applies the chosen card sort inside each section", () => {
    const input = [snip(1, "old", ["python"], 1), snip(2, "new", ["python"], 9)];
    const byTitle = groupCardSnippets(input, [], "tagCategory", "title", tagCategories);
    const byUpdated = groupCardSnippets(input, [], "tagCategory", "updated", tagCategories);
    expect(byTitle[0].snippets.map((s) => s.title)).toEqual(["new", "old"]);
    expect(byUpdated[0].snippets.map((s) => s.title)).toEqual(["new", "old"]);
    const reversed = [snip(1, "zzz", ["python"], 9), snip(2, "aaa", ["python"], 1)];
    expect(groupCardSnippets(reversed, [], "tagCategory", "title", tagCategories)[0].snippets.map((s) => s.title)).toEqual(["aaa", "zzz"]);
    expect(groupCardSnippets(reversed, [], "tagCategory", "updated", tagCategories)[0].snippets.map((s) => s.title)).toEqual(["zzz", "aaa"]);
  });

  it("returns no groups for no snippets", () => {
    expect(groupCardSnippets([], [], "tagCategory", "title", tagCategories)).toEqual([]);
  });
});
