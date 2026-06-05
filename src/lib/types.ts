export interface Tag {
  id: number;
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
  failed: number;
}
