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
