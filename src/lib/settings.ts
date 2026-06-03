import { create } from "zustand";

// Lightweight, frontend-only settings persisted to localStorage. These are
// UI preferences (not vault data), so they don't belong in the SQLite store.

const STORAGE_KEY = "codevault.settings";

interface Settings {
  defaultLanguage: string;
}

const DEFAULTS: Settings = {
  defaultLanguage: "bash",
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

interface SettingsState extends Settings {
  setDefaultLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...load(),
  setDefaultLanguage: (defaultLanguage) => {
    set({ defaultLanguage });
    persist(get());
  },
}));

function persist(state: Settings) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ defaultLanguage: state.defaultLanguage }),
    );
  } catch {
    // ignore quota / availability errors — settings are best-effort
  }
}
