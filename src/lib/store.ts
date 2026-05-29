import { create } from "zustand";
import { api } from "./api";
import type { Snippet, SnippetPatch } from "./types";

interface VaultState {
  snippets: Snippet[];
  selectedId: number | null;
  searchQuery: string;
  activeTag: string | null;
  activeLanguage: string | null;
  isLoading: boolean;
  deleteConfirmId: number | null;

  // lifecycle
  loadSnippets: () => Promise<void>;

  // selection & filter
  selectSnippet: (id: number) => void;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveLanguage: (lang: string | null) => void;

  // CRUD
  createSnippet: () => Promise<void>;
  updateSnippet: (id: number, patch: SnippetPatch) => Promise<void>;
  updateTags: (id: number, tags: string[]) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  confirmDelete: (id: number | null) => void;
  deleteSnippet: (id: number) => Promise<void>;

  // computed
  filteredSnippets: () => Snippet[];
  selectedSnippet: () => Snippet | null;
  allTags: () => string[];
}

export const useVaultStore = create<VaultState>((set, get) => ({
  snippets: [],
  selectedId: null,
  searchQuery: "",
  activeTag: null,
  activeLanguage: null,
  isLoading: false,
  deleteConfirmId: null,

  loadSnippets: async () => {
    set({ isLoading: true });
    try {
      const snippets = await api.listSnippets();
      set({ snippets, selectedId: snippets[0]?.id ?? null, isLoading: false });
    } catch (err) {
      console.error("loadSnippets:", err);
      set({ isLoading: false });
    }
  },

  selectSnippet: (id) => set({ selectedId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),

  createSnippet: async () => {
    try {
      const snippet = await api.createSnippet({
        title: "Untitled Snippet",
        description: "",
        language: "bash",
        code: "",
        notes: "",
        favorite: false,
        tags: [],
      });
      set((s) => ({ snippets: [snippet, ...s.snippets], selectedId: snippet.id }));
    } catch (err) {
      console.error("createSnippet:", err);
    }
  },

  updateSnippet: async (id, patch) => {
    try {
      const updated = await api.updateSnippet(id, patch);
      set((s) => ({
        snippets: s.snippets.map((sn) => (sn.id === id ? updated : sn)),
      }));
    } catch (err) {
      console.error("updateSnippet:", err);
    }
  },

  updateTags: async (id, tags) => {
    try {
      await api.setSnippetTags(id, tags);
      // Re-fetch only the affected snippet to get updated tag list
      const updated = await api.getSnippet(id);
      set((s) => ({
        snippets: s.snippets.map((sn) => (sn.id === id ? updated : sn)),
      }));
    } catch (err) {
      console.error("updateTags:", err);
    }
  },

  toggleFavorite: async (id) => {
    try {
      const favorite = await api.toggleFavorite(id);
      set((s) => ({
        snippets: s.snippets.map((sn) =>
          sn.id === id ? { ...sn, favorite } : sn
        ),
      }));
    } catch (err) {
      console.error("toggleFavorite:", err);
    }
  },

  confirmDelete: (id) => set({ deleteConfirmId: id }),

  deleteSnippet: async (id) => {
    try {
      await api.deleteSnippet(id);
      set((s) => {
        const snippets = s.snippets.filter((sn) => sn.id !== id);
        const selectedId =
          s.selectedId === id ? (snippets[0]?.id ?? null) : s.selectedId;
        return { snippets, selectedId, deleteConfirmId: null };
      });
    } catch (err) {
      console.error("deleteSnippet:", err);
    }
  },

  filteredSnippets: () => {
    const { snippets, searchQuery, activeTag, activeLanguage } = get();
    const q = searchQuery.toLowerCase();
    return snippets.filter((s) => {
      if (
        q &&
        !s.title.toLowerCase().includes(q) &&
        !s.code.toLowerCase().includes(q) &&
        !s.tags.some((t) => t.includes(q))
      )
        return false;
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
    const tagSet = new Set<string>();
    snippets.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },
}));
