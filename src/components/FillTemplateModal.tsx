import { useEffect, useMemo, useRef, useState } from "react";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useVaultStore } from "../lib/store";
import { PLACEHOLDER_SOURCE, parsePlaceholders, renderTemplate } from "../lib/template";
import { toast } from "../lib/toast";

type Values = Record<string, string>;

// Last values typed per snippet, so re-filling a template is one keystroke.
// Session-only on purpose: placeholders often hold hostnames or tokens, and
// those shouldn't be written to localStorage.
const lastValues = new Map<number, Values>();

type Segment =
  | { kind: "text"; text: string }
  | { kind: "filled"; text: string }
  | { kind: "missing"; text: string };

// Split the template into literal text and placeholder pieces so the preview
// can tint substituted values and flag still-empty required ones.
function previewSegments(code: string, values: Values): Segment[] {
  const defaults = new Map(parsePlaceholders(code).map((p) => [p.name, p.default]));
  const segments: Segment[] = [];
  let last = 0;
  for (const m of code.matchAll(new RegExp(PLACEHOLDER_SOURCE, "g"))) {
    const start = m.index ?? 0;
    if (start > last) segments.push({ kind: "text", text: code.slice(last, start) });
    const value = values[m[1]] || defaults.get(m[1]);
    segments.push(value != null ? { kind: "filled", text: value } : { kind: "missing", text: m[0] });
    last = start + m[0].length;
  }
  if (last < code.length) segments.push({ kind: "text", text: code.slice(last) });
  return segments;
}

export default function FillTemplateModal() {
  const target = useVaultStore((s) => s.fillTemplate);
  const openFillTemplate = useVaultStore((s) => s.openFillTemplate);
  const close = () => openFillTemplate(null);

  const placeholders = useMemo(() => (target ? parsePlaceholders(target.code) : []), [target]);
  const [values, setValues] = useState<Values>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!target) return;
    const remembered = lastValues.get(target.id) ?? {};
    setValues(remembered);
    // Focus the first required field still empty (else the first field) once mounted
    const first = placeholders.findIndex((p) => p.default === null && !remembered[p.name]);
    requestAnimationFrame(() => inputRefs.current[Math.max(first, 0)]?.select());
  }, [target, placeholders]);

  if (!target) return null;

  // Blank means "use the default", so an untouched field never blocks copying.
  const effective = (name: string) => values[name] || undefined;
  const missing = placeholders.filter((p) => p.default === null && !effective(p.name));
  const ready = missing.length === 0;

  const setValue = (name: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      lastValues.set(target.id, next);
      return next;
    });
  };

  const copy = () => {
    if (!ready) return;
    const filled = Object.fromEntries(placeholders.map((p) => [p.name, effective(p.name)]));
    writeText(renderTemplate(target.code, filled))
      .then(() => {
        toast.success("Filled snippet copied to clipboard");
        close();
      })
      .catch(() => toast.error("Failed to copy"));
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (ready) {
        copy();
      } else {
        // Jump to the next empty required field (wrapping around)
        const order = [...placeholders.keys()].map((i) => (index + 1 + i) % placeholders.length);
        const next = order.find((i) => missing.includes(placeholders[i]));
        if (next !== undefined) inputRefs.current[next]?.focus();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-lg mx-4 shadow-2xl font-mono max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-zinc-100 font-semibold text-sm mb-1">Fill template</h3>
        <p className="text-zinc-500 text-xs mb-4 truncate">
          <span className="text-zinc-300">{target.title || "Untitled Snippet"}</span>
          {" · "}
          {placeholders.length} placeholder{placeholders.length === 1 ? "" : "s"}
        </p>

        <div className="space-y-2 mb-4 overflow-y-auto">
          {placeholders.map((p, i) => {
            const isMissing = missing.includes(p);
            return (
              <label key={p.name} className="flex items-center gap-3">
                <span className="w-32 flex-shrink-0 truncate text-xs text-emerald-400" title={p.name}>
                  {p.name}
                </span>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className={`flex-1 min-w-0 bg-zinc-800 border text-zinc-200 text-xs rounded px-2 py-1.5 outline-none focus:border-emerald-700 transition-colors placeholder-zinc-600 ${
                    isMissing ? "border-amber-800" : "border-zinc-700"
                  }`}
                  value={values[p.name] ?? ""}
                  onChange={(e) => setValue(p.name, e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  placeholder={p.default !== null ? `${p.default || "(empty)"} — default` : "required"}
                  spellCheck={false}
                  autoComplete="off"
                />
              </label>
            );
          })}
        </div>

        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5">preview</div>
        <pre className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-zinc-300 whitespace-pre-wrap break-all overflow-auto min-h-[3rem] max-h-56 mb-5">
          {previewSegments(target.code, values).map((seg, i) =>
            seg.kind === "text" ? (
              <span key={i}>{seg.text}</span>
            ) : (
              <span
                key={i}
                className={seg.kind === "filled" ? "text-emerald-300 bg-emerald-950 rounded-sm" : "text-amber-400"}
              >
                {seg.text}
              </span>
            ),
          )}
        </pre>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-600">
            {ready ? "enter to copy · esc to cancel" : `${missing.length} required left`}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={close}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              cancel
            </button>
            <button
              onClick={copy}
              disabled={!ready}
              className="px-4 py-2 text-xs bg-emerald-900 border border-emerald-700 text-emerald-300 rounded hover:bg-emerald-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              copy filled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
