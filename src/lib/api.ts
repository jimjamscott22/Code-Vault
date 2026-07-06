import { invoke } from "@tauri-apps/api/core";
import type { Folder, ImportResult, ImportStrategy, MarkdownDirResult, NewFolder, NewSnippet, Snippet, SnippetPatch } from "./types";

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

  listFolders: () =>
    invoke<Folder[]>("list_folders"),

  createFolder: (input: NewFolder) =>
    invoke<Folder>("create_folder", { input }),

  renameFolder: (id: number, name: string) =>
    invoke<Folder>("rename_folder", { id, name }),

  deleteFolder: (id: number) =>
    invoke<void>("delete_folder", { id }),

  moveSnippetToFolder: (id: number, folderId: number | null) =>
    invoke<Snippet>("move_snippet_to_folder", { id, folderId }),

  getDataDir: () =>
    invoke<string>("get_data_dir"),

  exportVault: (path: string) =>
    invoke<void>("export_vault", { path }),

  importVault: (path: string, strategy: ImportStrategy) =>
    invoke<ImportResult>("import_vault", { path, strategy }),

  importMarkdown: (path: string, strategy: ImportStrategy) =>
    invoke<ImportResult>("import_markdown", { path, strategy }),

  importMarkdownDir: (path: string, strategy: ImportStrategy) =>
    invoke<MarkdownDirResult>("import_markdown_dir", { path, strategy }),
};
