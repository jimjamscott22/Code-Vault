import { create } from "zustand";

// Lightweight, frontend-only settings persisted to localStorage. These are
// UI preferences (not vault data), so they don't belong in the SQLite store.

const STORAGE_KEY = "codevault.settings";

export type Theme = "dark" | "light";
export type ViewMode = "list" | "cards";

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
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
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
  toggleViewMode: () => void;
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
  toggleViewMode: () => get().setViewMode(get().viewMode === "list" ? "cards" : "list"),
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
