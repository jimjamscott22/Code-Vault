import { describe, expect, it } from "vitest";
import { groupSnippetsByTagCategory } from "./tagCategoryGroups";
import type { Snippet, TagCategory } from "./types";

function snip(id: number, title: string, tags: string[]): Snippet {
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
    updated_at: 0,
  };
}

const lang: TagCategory = { id: 1, name: "Language", sort_order: 0, created_at: 0 };
const tool: TagCategory = { id: 2, name: "Tool", sort_order: 1, created_at: 0 };

const titles = (g: { snippets: Snippet[] }) => g.snippets.map((s) => s.title);

describe("groupSnippetsByTagCategory", () => {
  it("puts a snippet with no tags in Uncategorized exactly once", () => {
    const groups = groupSnippetsByTagCategory([snip(1, "bare", [])], [lang], {}, true);
    expect(groups).toHaveLength(1);
    expect(groups[0].category).toBeNull();
    expect(titles(groups[0])).toEqual(["bare"]);
  });

  it("lists a snippet once per category, not once per matching tag", () => {
    const byName = { python: 1, rust: 1 };
    const groups = groupSnippetsByTagCategory([snip(1, "both", ["python", "rust"])], [lang], byName, true);
    expect(groups).toHaveLength(1);
    expect(titles(groups[0])).toEqual(["both"]);
  });

  it("shows a multi-category snippet in every matching category", () => {
    const byName = { python: 1, cli: 2 };
    const groups = groupSnippetsByTagCategory([snip(1, "x", ["python", "cli"])], [lang, tool], byName, true);
    expect(groups.map((g) => g.category?.name)).toEqual(["Language", "Tool"]);
    expect(groups.every((g) => titles(g).join() === "x")).toBe(true);
  });

  it("orders categories by sort_order with Uncategorized last and omits empty ones", () => {
    const byName = { cli: 2 };
    const groups = groupSnippetsByTagCategory(
      [snip(1, "u", ["loose"]), snip(2, "t", ["cli"])],
      [lang, tool],
      byName,
      true,
    );
    expect(groups.map((g) => g.category?.name ?? null)).toEqual(["Tool", null]);
  });

  it("keeps same-tag snippets contiguous using the alphabetically first matching tag", () => {
    // "Z first" is tagged [b, a]; its first matching tag alphabetically is "a",
    // so it must sit with the other "a" snippet, not with the "b" snippet.
    const byName = { a: 1, b: 1 };
    const groups = groupSnippetsByTagCategory(
      [snip(1, "Z first", ["b", "a"]), snip(2, "A second", ["a"]), snip(3, "M third", ["b"])],
      [lang],
      byName,
      true,
    );
    expect(titles(groups[0])).toEqual(["A second", "Z first", "M third"]);
  });

  it("sorts snippets whose tag is not yet in the category map by tag name, not to the top", () => {
    // "zeta" was created after startup, so it is absent from the map entirely.
    const byName = { alpha: null };
    const groups = groupSnippetsByTagCategory(
      [snip(1, "new tag", ["zeta"]), snip(2, "known tag", ["alpha"])],
      [lang],
      byName,
      true,
    );
    expect(groups[0].category).toBeNull();
    expect(titles(groups[0])).toEqual(["known tag", "new tag"]);
  });

  it("preserves the caller's order within a group when sortWithinGroup is false", () => {
    const byName = { a: 1, b: 1 };
    const input = [snip(1, "second alphabetically", ["b"]), snip(2, "first alphabetically", ["a"])];
    const groups = groupSnippetsByTagCategory(input, [lang], byName, false);
    expect(titles(groups[0])).toEqual(["second alphabetically", "first alphabetically"]);
  });
});
