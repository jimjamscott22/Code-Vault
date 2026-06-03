// Languages CodeVault knows about. CodeEditor's LANG_MAP decides which of
// these get real syntax highlighting; the rest render as plain text.
export const LANGUAGES = [
  "bash", "css", "html", "javascript", "json", "markdown",
  "nginx", "python", "rust", "sql", "toml", "typescript", "yaml",
] as const;

export type Language = (typeof LANGUAGES)[number];
