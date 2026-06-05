import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

// Bespoke CodeVault editor themes — a tuned alternative to the ubiquitous
// `oneDark`. The palette echoes the app's emerald accent: emerald keywords,
// warm amber strings, cyan calls, violet literals, with a soft "phosphor"
// glow on the active line. Two variants share one hue language so switching
// light/dark feels like the same theme at different brightness.

const DARK = {
  bg: "#09090b", // zinc-950
  fg: "#e4e4e7", // zinc-200
  caret: "#34d399", // emerald-400
  selection: "rgba(16,185,129,0.20)",
  selectionMatch: "rgba(16,185,129,0.12)",
  lineHighlight: "rgba(16,185,129,0.055)",
  gutterFg: "#3f3f46", // zinc-700
  gutterActive: "#34d399",
  comment: "#52525b", // zinc-600
  keyword: "#34d399", // emerald-400
  string: "#fcd34d", // amber-300
  func: "#67e8f9", // cyan-300
  literal: "#c4b5fd", // violet-300
  type: "#5eead4", // teal-300
  prop: "#a5b4fc", // indigo-300
  heading: "#34d399",
  invalid: "#f87171", // red-400
};

const LIGHT = {
  bg: "#fafaf9", // warm off-white
  fg: "#27272a", // zinc-800
  caret: "#059669", // emerald-600
  selection: "rgba(5,150,105,0.16)",
  selectionMatch: "rgba(5,150,105,0.10)",
  lineHighlight: "rgba(5,150,105,0.06)",
  gutterFg: "#a8a29e", // stone-400
  gutterActive: "#059669",
  comment: "#a1a1aa", // zinc-400
  keyword: "#047857", // emerald-700
  string: "#b45309", // amber-700
  func: "#0e7490", // cyan-700
  literal: "#7c3aed", // violet-600
  type: "#0f766e", // teal-700
  prop: "#4338ca", // indigo-700
  heading: "#047857",
  invalid: "#dc2626", // red-600
};

type Palette = typeof DARK;

function build(theme: "dark" | "light", c: Palette): Extension {
  return createTheme({
    theme,
    settings: {
      background: c.bg,
      foreground: c.fg,
      caret: c.caret,
      selection: c.selection,
      selectionMatch: c.selectionMatch,
      lineHighlight: c.lineHighlight,
      gutterBackground: c.bg,
      gutterForeground: c.gutterFg,
      gutterActiveForeground: c.gutterActive,
      fontFamily: "var(--font-mono)",
    },
    styles: [
      { tag: [t.comment, t.lineComment, t.blockComment], color: c.comment, fontStyle: "italic" },
      { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword], color: c.keyword },
      { tag: [t.string, t.special(t.string), t.regexp], color: c.string },
      { tag: [t.function(t.variableName), t.function(t.propertyName), t.macroName], color: c.func },
      { tag: [t.number, t.bool, t.null, t.atom], color: c.literal },
      { tag: [t.typeName, t.className, t.namespace, t.definition(t.typeName)], color: c.type },
      { tag: [t.propertyName, t.attributeName], color: c.prop },
      { tag: [t.tagName], color: c.keyword },
      { tag: [t.variableName, t.definition(t.variableName)], color: c.fg },
      { tag: [t.operator, t.punctuation, t.separator, t.bracket], color: c.fg },
      { tag: [t.heading, t.heading1, t.heading2, t.heading3], color: c.heading, fontWeight: "700" },
      { tag: [t.link, t.url], color: c.string, textDecoration: "underline" },
      { tag: [t.emphasis], fontStyle: "italic" },
      { tag: [t.strong], fontWeight: "700" },
      { tag: [t.meta, t.processingInstruction], color: c.comment },
      { tag: [t.invalid], color: c.invalid },
    ],
  });
}

export const darkEditorTheme = build("dark", DARK);
export const lightEditorTheme = build("light", LIGHT);
