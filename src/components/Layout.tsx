import CommandPalette from "./CommandPalette";
import DeleteModal from "./DeleteModal";
import Settings from "./Settings";
import Shortcuts from "./Shortcuts";
import Sidebar from "./Sidebar";
import SnippetBoard from "./SnippetBoard";
import SnippetCards from "./SnippetCards";
import SnippetDetail from "./SnippetDetail";
import Toaster from "./Toaster";
import { useSettingsStore } from "../lib/settings";

export default function Layout() {
  const viewMode = useSettingsStore((s) => s.viewMode);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Left rail: search + filters + snippet list */}
      <div className="w-72 flex-shrink-0 flex flex-col h-full overflow-hidden">
        <Sidebar />
      </div>

      {/* Main pane: detail editor, card grid, or folder board */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        {viewMode === "cards" ? (
          <SnippetCards />
        ) : viewMode === "board" ? (
          <SnippetBoard />
        ) : (
          <SnippetDetail />
        )}
      </div>

      {/* Global overlays + handlers */}
      <DeleteModal />
      <CommandPalette />
      <Settings />
      <Toaster />
      <Shortcuts />
    </div>
  );
}
