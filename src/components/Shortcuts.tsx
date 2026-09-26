import { useEffect } from "react";
import { useVaultStore } from "../lib/store";
import { useSettingsStore } from "../lib/settings";

/**
 * Global keyboard shortcuts. Renders nothing; just registers a window listener.
 *
 *   Ctrl/Cmd+N  new snippet
 *   Ctrl/Cmd+K  toggle command palette
 *   Ctrl/Cmd+D  toggle favourite of the selected snippet
 *   Ctrl/Cmd+/  toggle the notes pane
 *   Ctrl/Cmd+,  toggle settings
 *   Ctrl/Cmd+G  toggle list / card view
 *   Escape      close the command palette / settings
 *
 * Ctrl+F (focus search) lives in Sidebar; Ctrl+S (flush save) lives in
 * SnippetDetail, since those act on component-local refs/state.
 */
export default function Shortcuts() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const store = useVaultStore.getState();

      if (e.key === "Escape") {
        if (store.paletteOpen) {
          e.preventDefault();
          store.setPaletteOpen(false);
          return;
        }
        if (store.settingsOpen) {
          e.preventDefault();
          store.setSettingsOpen(false);
          return;
        }
      }

      if (!mod) return;

      // Ctrl/Cmd+, opens settings (",": e.key is "," with no shift)
      if (e.key === ",") {
        e.preventDefault();
        store.setSettingsOpen(!store.settingsOpen);
        return;
      }

      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault();
          store.createSnippet();
          break;
        case "k":
          e.preventDefault();
          store.togglePalette();
          break;
        case "d":
          if (store.selectedId !== null) {
            e.preventDefault();
            store.toggleFavorite(store.selectedId);
          }
          break;
        case "g":
          // Leave Ctrl+G to CodeMirror's "find next" while editing code.
          if ((e.target as Element | null)?.closest?.(".cm-editor")) break;
          e.preventDefault();
          useSettingsStore.getState().toggleViewMode();
          break;
        case "/":
          e.preventDefault();
          store.toggleNotes();
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
