import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useVaultStore } from "../lib/store";
import { toast } from "../lib/toast";
import LanguageBadge from "./LanguageBadge";

export default function CommandPalette() {
  const paletteOpen = useVaultStore((s) => s.paletteOpen);
  const setPaletteOpen = useVaultStore((s) => s.setPaletteOpen);
  const snippets = useVaultStore((s) => s.snippets);
  const selected = useVaultStore((s) => s.selectedSnippet());
  const {
    createSnippet,
    toggleFavorite,
    confirmDelete,
    selectSnippet,
    toggleNotes,
    setSettingsOpen,
  } = useVaultStore();

  const [search, setSearch] = useState("");

  // Reset the query each time the palette opens
  useEffect(() => {
    if (paletteOpen) setSearch("");
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const close = () => setPaletteOpen(false);

  // Wrap an action so every command closes the palette afterwards
  const run = (fn: () => void) => () => {
    close();
    fn();
  };

  const copySelected = run(() => {
    if (!selected) return;
    writeText(selected.code)
      .then(() => toast.success("Code copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[12vh]"
      onClick={close}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl mx-4">
        <Command
          label="Command palette"
          className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden font-mono"
          // cmdk filters items by their `value`; keep it simple and case-insensitive
        >
          <Command.Input
            autoFocus
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search snippets…"
            className="w-full bg-transparent px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none border-b border-zinc-800"
          />
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-xs text-zinc-600">
              No results.
            </Command.Empty>

            <Command.Group
              heading="Actions"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-zinc-600"
            >
              <PaletteItem value="new snippet create" onSelect={run(createSnippet)}>
                ＋ New snippet
                <Shortcut keys="Ctrl+N" />
              </PaletteItem>
              <PaletteItem
                value="settings import export preferences"
                onSelect={run(() => setSettingsOpen(true))}
              >
                ⚙ Open settings
                <Shortcut keys="Ctrl+," />
              </PaletteItem>
              {selected && (
                <>
                  <PaletteItem
                    value={`favourite favorite star ${selected.title}`}
                    onSelect={run(() => toggleFavorite(selected.id))}
                  >
                    ★ {selected.favorite ? "Unfavourite" : "Favourite"} current snippet
                    <Shortcut keys="Ctrl+D" />
                  </PaletteItem>
                  <PaletteItem value={`copy code ${selected.title}`} onSelect={copySelected}>
                    ⧉ Copy current snippet code
                  </PaletteItem>
                  <PaletteItem value="toggle notes" onSelect={run(toggleNotes)}>
                    ▭ Toggle notes pane
                    <Shortcut keys="Ctrl+/" />
                  </PaletteItem>
                  <PaletteItem
                    value={`delete remove ${selected.title}`}
                    onSelect={run(() => confirmDelete(selected.id))}
                  >
                    🗑 Delete current snippet
                  </PaletteItem>
                </>
              )}
            </Command.Group>

            <Command.Group
              heading="Snippets"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-zinc-600"
            >
              {snippets.map((s) => (
                <PaletteItem
                  key={s.id}
                  value={`${s.title} ${s.language} ${s.tags.join(" ")}`}
                  onSelect={run(() => selectSnippet(s.id))}
                >
                  <span className="flex-1 min-w-0 truncate text-zinc-200">{s.title}</span>
                  <LanguageBadge language={s.language} />
                </PaletteItem>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function PaletteItem({
  value,
  onSelect,
  children,
}: {
  value: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex items-center gap-2 px-3 py-2 rounded text-sm text-zinc-300 cursor-pointer data-[selected=true]:bg-zinc-800 data-[selected=true]:text-zinc-100 transition-colors"
    >
      {children}
    </Command.Item>
  );
}

function Shortcut({ keys }: { keys: string }) {
  return (
    <span className="ml-auto text-xs text-zinc-600 tracking-wide flex-shrink-0">{keys}</span>
  );
}
