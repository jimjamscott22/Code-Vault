// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../lib/api";
import { useVaultStore } from "../lib/store";
import type { Snippet, SnippetPatch } from "../lib/types";
import SnippetDetail from "./SnippetDetail";

vi.mock("@tauri-apps/plugin-clipboard-manager", () => ({
  writeText: vi.fn(() => Promise.resolve()),
}));

vi.mock("./CodeEditor", () => ({
  default: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Let React 19 know we are inside an act()-capable test environment
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const BASE_SNIPPET: Snippet = {
  id: 1,
  title: "Original Title",
  description: "Original description",
  language: "typescript",
  code: "const value = 1;",
  notes: "Original notes",
  favorite: false,
  folder_id: null,
  tags: ["util"],
  created_at: 1000,
  updated_at: 1000,
};

function setInputValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("SnippetDetail", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    useVaultStore.setState({
      snippets: [{ ...BASE_SNIPPET }],
      folders: [],
      tagCategories: [],
      tagCategoryByName: {},
      selectedId: BASE_SNIPPET.id,
      cardDetailOpen: true,
      notesVisible: true,
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("carries flushed draft into a replacement editor when switching views within the 500 ms debounce", async () => {
    let resolveFirstSave: ((s: Snippet) => void) | null = null;
    const updateSpy = vi.spyOn(api, "updateSnippet").mockImplementation((id: number, patch: SnippetPatch) => {
      const current = useVaultStore.getState().snippets.find((s) => s.id === id) ?? BASE_SNIPPET;
      const saved: Snippet = { ...current, ...patch, updated_at: current.updated_at + 10 };
      if (!resolveFirstSave) {
        return new Promise<Snippet>((resolve) => {
          resolveFirstSave = () => resolve(saved);
        });
      }
      return Promise.resolve(saved);
    });

    // Render in "card detail pane" wrapper, then switch to "list view" wrapper
    // so the first SnippetDetail unmounts and a replacement SnippetDetail mounts
    // in the same commit.
    function ViewHarness({ mode }: { mode: "cards" | "list" }) {
      return mode === "cards" ? (
        <div data-view="cards">
          <SnippetDetail />
        </div>
      ) : (
        <section data-view="list">
          <SnippetDetail />
        </section>
      );
    }

    act(() => {
      root.render(<ViewHarness mode="cards" />);
    });

    const titleInput = () =>
      container.querySelector<HTMLInputElement>('input[placeholder="Untitled Snippet"]')!;
    const descInput = () =>
      container.querySelector<HTMLInputElement>('input[placeholder="Short description…"]')!;
    const codeEditor = () =>
      container.querySelector<HTMLTextAreaElement>('textarea[placeholder="// paste or type your snippet here"]')!;

    expect(titleInput().value).toBe("Original Title");
    expect(codeEditor().value).toBe("const value = 1;");

    // Edit title and code in the card detail pane
    act(() => {
      setInputValue(titleInput(), "Flushed Title");
      setInputValue(codeEditor(), "const value = 2;");
    });

    // Switch to List view after 200 ms (within the 500 ms autosave debounce)
    act(() => {
      vi.advanceTimersByTime(200);
      root.render(<ViewHarness mode="list" />);
    });

    // Unmount cleanup should have started the save for the flushed draft
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(1, {
      title: "Flushed Title",
      description: "Original description",
      language: "typescript",
      code: "const value = 2;",
      notes: "Original notes",
    });

    // Even before the async IPC save resolves, the replacement editor in List
    // view must display the flushed draft rather than stale store content.
    expect(titleInput().value).toBe("Flushed Title");
    expect(codeEditor().value).toBe("const value = 2;");

    // Resolve the in-flight save from the unmount flush
    await act(async () => {
      resolveFirstSave?.(BASE_SNIPPET);
    });

    expect(titleInput().value).toBe("Flushed Title");
    expect(codeEditor().value).toBe("const value = 2;");

    // A subsequent edit in List view must preserve the flushed title and code
    act(() => {
      setInputValue(descInput(), "Edited in list view");
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(updateSpy).toHaveBeenCalledTimes(2);
    expect(updateSpy).toHaveBeenLastCalledWith(1, {
      title: "Flushed Title",
      description: "Edited in list view",
      language: "typescript",
      code: "const value = 2;",
      notes: "Original notes",
    });
  });

  it("rehydrates the same snippet when its pristine form receives a save result", () => {
    act(() => {
      root.render(<SnippetDetail />);
    });

    const titleInput = () =>
      container.querySelector<HTMLInputElement>('input[placeholder="Untitled Snippet"]')!;
    const codeEditor = () =>
      container.querySelector<HTMLTextAreaElement>('textarea[placeholder="// paste or type your snippet here"]')!;

    expect(titleInput().value).toBe("Original Title");

    // Simulate an async save completing in the store for the same snippet ID
    // while the editor form is pristine (!isDirty).
    act(() => {
      useVaultStore.setState({
        snippets: [
          {
            ...BASE_SNIPPET,
            title: "Updated From Store",
            code: "const value = 42;",
            updated_at: 2000,
          },
        ],
      });
    });

    expect(titleInput().value).toBe("Updated From Store");
    expect(codeEditor().value).toBe("const value = 42;");
  });

  it("does not overwrite unsaved local edits when a store update arrives for the same snippet", () => {
    act(() => {
      root.render(<SnippetDetail />);
    });

    const titleInput = () =>
      container.querySelector<HTMLInputElement>('input[placeholder="Untitled Snippet"]')!;

    act(() => {
      setInputValue(titleInput(), "Typing In Progress");
    });

    act(() => {
      useVaultStore.setState({
        snippets: [
          {
            ...BASE_SNIPPET,
            title: "Earlier Save Result",
            updated_at: 2000,
          },
        ],
      });
    });

    expect(titleInput().value).toBe("Typing In Progress");
  });
});
