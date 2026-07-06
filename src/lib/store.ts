import { create } from "zustand";
import { api } from "./api";
import { toast } from "./toast";
import { useSettingsStore } from "./settings";
import type { Folder, Snippet, SnippetPatch } from "./types";

/** Sentinel for the "no folder" filter, distinct from `null` (= "all folders"). */
export const UNFILED = "unfiled" as const;
export type FolderFilter = number | typeof UNFILED | null;

interface VaultState {
  snippets: Snippet[];
  folders: Folder[];
  selectedId: number | null;
  searchQuery: string;
  activeTag: string | null;
  activeLanguage: string | null;
  activeFolder: FolderFilter;
  isLoading: boolean;
  deleteConfirmId: number | null;

  // UI state
  paletteOpen: boolean;
  notesVisible: boolean;
  settingsOpen: boolean;

  // lifecycle
  loadSnippets: () => Promise<void>;
  loadFolders: () => Promise<void>;

  // selection & filter
  selectSnippet: (id: number) => void;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  setActiveLanguage: (lang: string | null) => void;
  setActiveFolder: (folder: FolderFilter) => void;

  // UI toggles
  setPaletteOpen: (open: boolean) => void;
  togglePalette: () => void;
  toggleNotes: () => void;
  setSettingsOpen: (open: boolean) => void;

  // CRUD
  createSnippet: () => Promise<void>;
  updateSnippet: (id: number, patch: SnippetPatch) => Promise<void>;
  updateTags: (id: number, tags: string[]) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  confirmDelete: (id: number | null) => void;
  deleteSnippet: (id: number) => Promise<void>;
  moveSnippetToFolder: (id: number, folderId: number | null) => Promise<void>;
  createFolder: (name: string) => Promise<void>;
  renameFolder: (id: number, name: string) => Promise<void>;
  deleteFolder: (id: number) => Promise<void>;

  // computed
  filteredSnippets: () => Snippet[];
  selectedSnippet: () => Snippet | null;
  allTags: () => string[];
}

export const useVaultStore = create<VaultState>((set, get) => ({
  snippets: [],
  folders: [],
  selectedId: null,
  searchQuery: "",
  activeTag: null,
  activeLanguage: null,
  activeFolder: null,
  isLoading: false,
  deleteConfirmId: null,
  paletteOpen: false,
  notesVisible: true,
  settingsOpen: false,

  loadSnippets: async () => {
    set({ isLoading: true });
    try {
      const snippets = await api.listSnippets();
      set({ snippets, selectedId: snippets[0]?.id ?? null, isLoading: false });
    } catch (err) {
      console.error("loadSnippets:", err);
      toast.error(`Failed to load snippets: ${err}`);
      set({ isLoading: false });
    }
  },

  loadFolders: async () => {
    try {
      const folders = await api.listFolders();
      set({ folders });
    } catch (err) {
      console.error("loadFolders:", err);
      toast.error(`Failed to load folders: ${err}`);
    }
  },

  selectSnippet: (id) => set({ selectedId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveTag: (tag) => set({ activeTag: tag }),
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
  setActiveFolder: (folder) => set({ activeFolder: folder }),

  setPaletteOpen: (open) => set({ paletteOpen: open }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
  toggleNotes: () => set((s) => ({ notesVisible: !s.notesVisible })),
  setSettingsOpen: (open) => set({ settingsOpen: open }),

  createSnippet: async () => {
    try {
      const { activeFolder } = get();
      const snippet = await api.createSnippet({
        title: "Untitled Snippet",
        description: "",
        language: useSettingsStore.getState().defaultLanguage,
        code: "",
        notes: "",
        favorite: false,
        tags: [],
        folder_id: typeof activeFolder === "number" ? activeFolder : null,
      });
      set((s) => ({ snippets: [snippet, ...s.snippets], selectedId: snippet.id }));
    } catch (err) {
      console.error("createSnippet:", err);
      toast.error(`Failed to create snippet: ${err}`);
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
      toast.error(`Failed to save snippet: ${err}`);
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
      toast.error(`Failed to update tags: ${err}`);
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
      toast.error(`Failed to toggle favourite: ${err}`);
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
      toast.success("Snippet deleted");
    } catch (err) {
      console.error("deleteSnippet:", err);
      toast.error(`Failed to delete snippet: ${err}`);
    }
  },

  moveSnippetToFolder: async (id, folderId) => {
    try {
      const updated = await api.moveSnippetToFolder(id, folderId);
      set((s) => ({
        snippets: s.snippets.map((sn) => (sn.id === id ? updated : sn)),
      }));
    } catch (err) {
      console.error("moveSnippetToFolder:", err);
      toast.error(`Failed to move snippet: ${err}`);
    }
  },

  createFolder: async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const folder = await api.createFolder({ name: trimmed });
      set((s) => ({ folders: [...s.folders, folder].sort((a, b) => a.name.localeCompare(b.name)) }));
    } catch (err) {
      console.error("createFolder:", err);
      toast.error(`Failed to create folder: ${err}`);
    }
  },

  renameFolder: async (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const folder = await api.renameFolder(id, trimmed);
      set((s) => ({
        folders: s.folders.map((f) => (f.id === id ? folder : f)).sort((a, b) => a.name.localeCompare(b.name)),
      }));
    } catch (err) {
      console.error("renameFolder:", err);
      toast.error(`Failed to rename folder: ${err}`);
    }
  },

  deleteFolder: async (id) => {
    try {
      await api.deleteFolder(id);
      set((s) => ({
        folders: s.folders.filter((f) => f.id !== id),
        snippets: s.snippets.map((sn) => (sn.folder_id === id ? { ...sn, folder_id: null } : sn)),
        activeFolder: s.activeFolder === id ? null : s.activeFolder,
      }));
      toast.success("Folder deleted");
    } catch (err) {
      console.error("deleteFolder:", err);
      toast.error(`Failed to delete folder: ${err}`);
    }
  },

  filteredSnippets: () => {
    const { snippets, searchQuery, activeTag, activeLanguage, activeFolder } = get();
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
      if (activeFolder === UNFILED && s.folder_id !== null) return false;
      if (typeof activeFolder === "number" && s.folder_id !== activeFolder) return false;
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
