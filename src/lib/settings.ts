import { create } from "zustand";

// Lightweight, frontend-only settings persisted to localStorage. These are
// UI preferences (not vault data), so they don't belong in the SQLite store.

const STORAGE_KEY = "codevault.settings";

export type Theme = "dark" | "light";
export type ViewMode = "list" | "cards" | "board";
export const VIEW_MODES: ViewMode[] = ["list", "cards", "board"];

interface Settings {
  defaultLanguage: string;
  theme: Theme;
  viewMode: ViewMode;
}

const DEFAULTS: Settings = {
  defaultLanguage: "bash",
  theme: "dark",
  viewMode: "list",
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const merged: Settings = { ...DEFAULTS, ...JSON.parse(raw) };
    if (!VIEW_MODES.includes(merged.viewMode)) merged.viewMode = DEFAULTS.viewMode;
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
}));

function persist(state: Settings) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        defaultLanguage: state.defaultLanguage,
        theme: state.theme,
        viewMode: state.viewMode,
      }),
    );
  } catch {
    // ignore quota / availability errors — settings are best-effort
  }
}
