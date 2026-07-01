// Single source of truth for per-language color coding, shared by the
// language badge chip (SnippetDetail/SnippetList) and the sidebar snippet
// title text. Keyed by the values in `LANGUAGES` (src/lib/languages.ts).

export interface LanguageColorSet {
  /** bg + text classes for the small uppercase badge chip */
  badge: string;
  /** standalone text color for the snippet title in the sidebar list */
  text: string;
}

const LANGUAGE_COLORS: Record<string, LanguageColorSet> = {
  typescript: { badge: "bg-blue-900 text-blue-300", text: "text-blue-400" },
  javascript: { badge: "bg-yellow-900 text-yellow-300", text: "text-yellow-400" },
  python: { badge: "bg-sky-900 text-sky-300", text: "text-sky-400" },
  rust: { badge: "bg-orange-900 text-orange-300", text: "text-orange-400" },
  // Distinct from the app's emerald accent (used for selection/CTAs) and from
  // nginx's green, so an active bash row doesn't read as "already selected".
  bash: { badge: "bg-lime-900 text-lime-300", text: "text-lime-400" },
  sql: { badge: "bg-purple-900 text-purple-300", text: "text-purple-400" },
  yaml: { badge: "bg-cyan-900 text-cyan-300", text: "text-cyan-400" },
  nginx: { badge: "bg-green-900 text-green-300", text: "text-green-400" },
  html: { badge: "bg-red-900 text-red-300", text: "text-red-400" },
  css: { badge: "bg-pink-900 text-pink-300", text: "text-pink-400" },
  markdown: { badge: "bg-zinc-700 text-zinc-400", text: "text-zinc-300" },
  json: { badge: "bg-amber-900 text-amber-300", text: "text-amber-400" },
  toml: { badge: "bg-teal-900 text-teal-300", text: "text-teal-400" },
};

// Fallback for languages outside the known set (e.g. legacy/imported data).
const DEFAULT_COLORS: LanguageColorSet = {
  badge: "bg-zinc-700 text-zinc-400",
  text: "text-zinc-200",
};

export function getLanguageColors(language: string): LanguageColorSet {
  return LANGUAGE_COLORS[language.toLowerCase()] ?? DEFAULT_COLORS;
}
