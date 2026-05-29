import Sidebar from "./Sidebar";
import SnippetDetail from "./SnippetDetail";

export default function Layout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Left rail: search + filters + snippet list */}
      <div className="w-72 flex-shrink-0 flex flex-col h-full overflow-hidden">
        <Sidebar />
      </div>

      {/* Detail pane */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <SnippetDetail />
      </div>
    </div>
  );
}
