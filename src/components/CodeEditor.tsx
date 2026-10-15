import CodeMirror, { Decoration, EditorView, MatchDecorator, ViewPlugin, type DecorationSet, type ViewUpdate } from "@uiw/react-codemirror";
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
import { PLACEHOLDER_SOURCE } from "../lib/template";

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

// Tint `{{name}}` / `{{name:default}}` template placeholders (see lib/template.ts)
// on top of whatever language highlighting is active.
const placeholderMatcher = new MatchDecorator({
  regexp: new RegExp(PLACEHOLDER_SOURCE, "g"),
  decoration: Decoration.mark({ class: "cm-template-var" }),
});

const templatePlaceholders: Extension = [
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.decorations = placeholderMatcher.updateDeco(update, this.decorations);
      }
    },
    { decorations: (v) => v.decorations },
  ),
  EditorView.baseTheme({
    ".cm-template-var, .cm-template-var *": {
      color: "#34d399 !important",
      backgroundColor: "rgba(16, 185, 129, 0.14)",
      borderRadius: "3px",
    },
    "&light .cm-template-var, &light .cm-template-var *": {
      color: "#047857 !important",
    },
  }),
];

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
  const extensions: Extension[] = [
    ...(Array.isArray(langExt) ? langExt : [langExt]),
    templatePlaceholders,
  ];

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
