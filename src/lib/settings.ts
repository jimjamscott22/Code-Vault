import { create } from "zustand";

// Lightweight, frontend-only settings persisted to localStorage. These are
// UI preferences (not vault data), so they don't belong in the SQLite store.

const STORAGE_KEY = "codevault.settings";

export type Theme = "dark" | "light";
export type ViewMode = "list" | "cards" | "table" | "board";
export const VIEW_MODES: ViewMode[] = ["list", "cards", "table", "board"];

export type TableSortKey = "favorite" | "title" | "language" | "folder" | "updated";
export const TABLE_SORT_KEYS: TableSortKey[] = ["favorite", "title", "language", "folder", "updated"];
export interface TableSort {
  key: TableSortKey;
  dir: "asc" | "desc";
}

export type CardGroupBy = "none" | "folder" | "language";
export const CARD_GROUP_BYS: CardGroupBy[] = ["none", "folder", "language"];
export type CardSort = "title" | "updated";
export const CARD_SORTS: CardSort[] = ["title", "updated"];

interface Settings {
  defaultLanguage: string;
  theme: Theme;
  viewMode: ViewMode;
  tableSort: TableSort;
  cardGroupBy: CardGroupBy;
  cardSort: CardSort;
}

const DEFAULTS: Settings = {
  defaultLanguage: "bash",
  theme: "dark",
  viewMode: "list",
  tableSort: { key: "updated", dir: "desc" },
  cardGroupBy: "none",
  cardSort: "title",
};

function isTableSort(value: unknown): value is TableSort {
  const v = value as Partial<TableSort> | null;
  return (
    typeof v === "object" &&
    v !== null &&
    TABLE_SORT_KEYS.includes(v.key as TableSortKey) &&
    (v.dir === "asc" || v.dir === "desc")
  );
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const merged: Settings = { ...DEFAULTS, ...JSON.parse(raw) };
    if (!VIEW_MODES.includes(merged.viewMode)) merged.viewMode = DEFAULTS.viewMode;
    if (!isTableSort(merged.tableSort)) merged.tableSort = DEFAULTS.tableSort;
    if (!CARD_GROUP_BYS.includes(merged.cardGroupBy)) merged.cardGroupBy = DEFAULTS.cardGroupBy;
    if (!CARD_SORTS.includes(merged.cardSort)) merged.cardSort = DEFAULTS.cardSort;
    return merged;
  } catch {
    return DEFAULTS;
  }
}

// Toggle the root `.light` class so the CSS-variable ramp (index.css) flips the
// whole app, and `darkMode: "class"` Tailwind variants resolve correctly.
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
}

interface SettingsState extends Settings {
  setDefaultLanguage: (lang: string) => void;
  setTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;
  cycleViewMode: () => void;
  setTableSort: (sort: TableSort) => void;
  setCardGroupBy: (groupBy: CardGroupBy) => void;
  setCardSort: (sort: CardSort) => void;
}

const initial = load();
applyTheme(initial.theme); // apply persisted theme before first paint

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...initial,
  setDefaultLanguage: (defaultLanguage) => {
    set({ defaultLanguage });
    persist(get());
  },
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
    persist(get());
  },
  setViewMode: (viewMode) => {
    set({ viewMode });
    persist(get());
  },
  cycleViewMode: () => {
    const i = VIEW_MODES.indexOf(get().viewMode);
    get().setViewMode(VIEW_MODES[(i + 1) % VIEW_MODES.length]);
  },
  setTableSort: (tableSort) => {
    set({ tableSort });
    persist(get());
  },
  setCardGroupBy: (cardGroupBy) => {
    set({ cardGroupBy });
    persist(get());
  },
  setCardSort: (cardSort) => {
    set({ cardSort });
    persist(get());
  },
}));

function persist(state: Settings) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        defaultLanguage: state.defaultLanguage,
        theme: state.theme,
        viewMode: state.viewMode,
        tableSort: state.tableSort,
        cardGroupBy: state.cardGroupBy,
        cardSort: state.cardSort,
      }),
    );
  } catch {
    // ignore quota / availability errors — settings are best-effort
  }
}
