// Snippet templates: `{{name}}` / `{{name:default}}` placeholders filled in
// at copy time. Syntax must stay identical to the Rust implementation in
// crates/codevault-core/src/template.rs (used by the `codevault copy --var` CLI):
//   - name: letter or `_`, then letters, digits, `_` or `-`
//   - no whitespace inside the braces, so `{{ var }}` / `${{ secrets.X }}` are ignored
//   - optional default after the first `:`, up to `}}`, no `}` or newline
//   - repeated names are one variable; the first default seen wins

export interface Placeholder {
  name: string;
  default: string | null;
}

// Exported (non-global) so the editor can reuse it for highlighting.
export const PLACEHOLDER_SOURCE = String.raw`\{\{([A-Za-z_][A-Za-z0-9_-]*)(?::([^}\n]*))?\}\}`;

const placeholderRe = () => new RegExp(PLACEHOLDER_SOURCE, "g");

/** Distinct placeholders in order of first appearance. */
export function parsePlaceholders(code: string): Placeholder[] {
  const seen = new Map<string, Placeholder>();
  for (const m of code.matchAll(placeholderRe())) {
    const name = m[1];
    if (!seen.has(name)) seen.set(name, { name, default: m[2] ?? null });
  }
  return [...seen.values()];
}

/**
 * Substitute placeholders. A non-undefined entry in `values` wins (an empty
 * string is a real value); otherwise the placeholder's default is used, and
 * placeholders with neither are left as-is.
 */
export function renderTemplate(code: string, values: Record<string, string | undefined>): string {
  const defaults = new Map(parsePlaceholders(code).map((p) => [p.name, p.default]));
  return code.replace(placeholderRe(), (match, name: string) => {
    const value = values[name] ?? defaults.get(name);
    return value ?? match;
  });
}
