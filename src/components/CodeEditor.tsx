import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";
import type { Extension } from "@codemirror/state";
import { useSettingsStore } from "../lib/settings";
import { darkEditorTheme, lightEditorTheme } from "../lib/editorTheme";

const LANG_MAP: Record<string, () => Extension> = {
  bash:       () => [],
  css:        () => css(),
  html:       () => html(),
  javascript: () => javascript(),
  json:       () => javascript(),
  markdown:   () => markdown(),
  nginx:      () => [],
  python:     () => python(),
  rust:       () => rust(),
  sql:        () => sql(),
  toml:       () => [],
  typescript: () => javascript({ typescript: true }),
  yaml:       () => yaml(),
};

interface Props {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  minHeight = "100%",
  maxHeight,
}: Props) {
  const theme = useSettingsStore((s) => s.theme);
  const langExt = (LANG_MAP[language] ?? (() => []))();
  const extensions: Extension[] = Array.isArray(langExt) ? langExt : [langExt];

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={theme === "light" ? lightEditorTheme : darkEditorTheme}
      extensions={extensions}
      placeholder={placeholder}
      style={{ minHeight, maxHeight, overflow: "auto" }}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        autocompletion: true,
      }}
    />
  );
}
