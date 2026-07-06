export interface Tag {
  id: number;
  name: string;
}

export interface Folder {
  id: number;
  name: string;
  created_at: number;
}

export interface NewFolder {
  name: string;
}

export interface Snippet {
  id: number;
  title: string;
  description: string;
  language: string;
  code: string;
  notes: string;
  favorite: boolean;
  tags: string[];
  folder_id: number | null;
  created_at: number;
  updated_at: number;
}

export interface NewSnippet {
  title: string;
  description: string;
  language: string;
  code: string;
  notes: string;
  favorite: boolean;
  tags: string[];
  folder_id?: number | null;
}

export interface SnippetPatch {
  title?: string;
  description?: string;
  language?: string;
  code?: string;
  notes?: string;
  favorite?: boolean;
}

export type ImportStrategy = "skip" | "overwrite" | "rename";

export interface ImportResult {
  imported: number;
  overwritten: number;
  skipped: number;
  renamed: number;
}

export interface MarkdownDirResult {
  imported: number;
  overwritten: number;
  skipped: number;
  renamed: number;
  failed_files: number;
}
