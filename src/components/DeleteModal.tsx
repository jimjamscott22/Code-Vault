import { useVaultStore } from "../lib/store";

export default function DeleteModal() {
  const { deleteConfirmId, confirmDelete, deleteSnippet, snippets } = useVaultStore();

  if (deleteConfirmId === null) return null;

  const snippet = snippets.find((s) => s.id === deleteConfirmId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => confirmDelete(null)}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-zinc-100 font-mono font-semibold text-sm mb-2">
          Delete snippet?
        </h3>
        <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-6">
          <span className="text-zinc-200">"{snippet?.title ?? "this snippet"}"</span> will be
          permanently removed. This cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => confirmDelete(null)}
            className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            cancel
          </button>
          <button
            onClick={() => deleteSnippet(deleteConfirmId)}
            className="px-4 py-2 text-xs font-mono bg-red-900 border border-red-700 text-red-200 rounded hover:bg-red-800 transition-colors"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  );
}
