import { create } from "zustand";

// Lightweight, frontend-only settings persisted to localStorage. These are
// UI preferences (not vault data), so they don't belong in the SQLite store.

const STORAGE_KEY = "codevault.settings";

export type Theme = "dark" | "light";

interface Settings {
  defaultLanguage: string;
  theme: Theme;
}

const DEFAULTS: Settings = {
  defaultLanguage: "bash",
  theme: "dark",
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
}));

function persist(state: Settings) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ defaultLanguage: state.defaultLanguage, theme: state.theme }),
    );
  } catch {
    // ignore quota / availability errors — settings are best-effort
  }
}
