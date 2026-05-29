import { create } from "zustand";
import type { Snippet } from "./types";
import { mockSnippets } from "./mockData";

interface VaultState {
  snippets: Snippet[];
  selectedId: number | null;
  searchQuery: string;
  activeTag: string | null;
  activeLanguage: string | null;

  selectSnippet: (id: number) => void;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveLanguage: (lang: string | null) => void;

  filteredSnippets: () => Snippet[];
  selectedSnippet: () => Snippet | null;
  allTags: () => string[];
}

export const useVaultStore = create<VaultState>((set, get) => ({
  snippets: mockSnippets,
  selectedId: mockSnippets[0]?.id ?? null,
  searchQuery: "",
  activeTag: null,
  activeLanguage: null,

  selectSnippet: (id) => set({ selectedId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),

  filteredSnippets: () => {
    const { snippets, searchQuery, activeTag, activeLanguage } = get();
    const q = searchQuery.toLowerCase();
    return snippets.filter((s) => {
      if (q && !s.title.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q) && !s.tags.some((t) => t.includes(q))) return false;
      if (activeTag && !s.tags.includes(activeTag)) return false;
      if (activeLanguage && s.language !== activeLanguage) return false;
      return true;
    });
  },

  selectedSnippet: () => {
    const { snippets, selectedId } = get();
    return snippets.find((s) => s.id === selectedId) ?? null;
  },

  allTags: () => {
    const { snippets } = get();
    const set = new Set<string>();
    snippets.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  },
}));
