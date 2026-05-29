import { invoke } from "@tauri-apps/api/core";
import type { NewSnippet, Snippet, SnippetPatch } from "./types";

export const api = {
  listSnippets: () =>
    invoke<Snippet[]>("list_snippets"),

  getSnippet: (id: number) =>
    invoke<Snippet>("get_snippet", { id }),

  createSnippet: (input: NewSnippet) =>
    invoke<Snippet>("create_snippet", { input }),

  updateSnippet: (id: number, patch: SnippetPatch) =>
    invoke<Snippet>("update_snippet", { id, patch }),

  deleteSnippet: (id: number) =>
    invoke<void>("delete_snippet", { id }),

  toggleFavorite: (id: number) =>
    invoke<boolean>("toggle_favorite", { id }),

  listTags: () =>
    invoke<string[]>("list_tags"),

  setSnippetTags: (id: number, tagNames: string[]) =>
    invoke<void>("set_snippet_tags", { id, tagNames }),

  searchSnippets: (query: string) =>
    invoke<Snippet[]>("search_snippets", { query }),
};
