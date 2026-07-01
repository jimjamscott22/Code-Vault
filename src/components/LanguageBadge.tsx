import { getLanguageColors } from "../lib/languageColors";

interface Props {
  language: string;
}

export default function LanguageBadge({ language }: Props) {
  const cls = getLanguageColors(language).badge;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wide ${cls}`}>
      {language}
    </span>
  );
}
