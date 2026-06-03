import { useToastStore } from "../lib/toast";
import type { ToastKind } from "../lib/toast";

const KIND_STYLES: Record<ToastKind, string> = {
  info: "border-zinc-600 text-zinc-200",
  success: "border-emerald-700 text-emerald-200",
  error: "border-red-700 text-red-200",
};

const KIND_GLYPH: Record<ToastKind, string> = {
  info: "›",
  success: "✓",
  error: "✕",
};

export default function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`text-left bg-zinc-900 border rounded-lg px-3 py-2.5 shadow-2xl font-mono text-xs flex items-start gap-2 hover:bg-zinc-800 transition-colors ${KIND_STYLES[t.kind]}`}
          title="dismiss"
        >
          <span className="flex-shrink-0 font-bold">{KIND_GLYPH[t.kind]}</span>
          <span className="flex-1 leading-relaxed break-words">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
