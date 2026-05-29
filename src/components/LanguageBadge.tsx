const LANG_COLORS: Record<string, string> = {
  typescript: "bg-blue-900 text-blue-300",
  javascript: "bg-yellow-900 text-yellow-300",
  python: "bg-sky-900 text-sky-300",
  rust: "bg-orange-900 text-orange-300",
  bash: "bg-zinc-700 text-zinc-300",
  sql: "bg-purple-900 text-purple-300",
  yaml: "bg-cyan-900 text-cyan-300",
  nginx: "bg-green-900 text-green-300",
  html: "bg-red-900 text-red-300",
  css: "bg-pink-900 text-pink-300",
  markdown: "bg-zinc-700 text-zinc-400",
  json: "bg-amber-900 text-amber-300",
};

interface Props {
  language: string;
}

export default function LanguageBadge({ language }: Props) {
  const cls = LANG_COLORS[language.toLowerCase()] ?? "bg-zinc-700 text-zinc-400";
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wide ${cls}`}>
      {language}
    </span>
  );
}
