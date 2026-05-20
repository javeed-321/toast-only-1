"use client";

import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
// Prism-based syntax highlighting for code blocks in the preview. The `-all`
// JS bundle (Prism core + every language) touches `window` at load, so it's
// imported lazily on the client (see the effect below) rather than statically —
// a static import would crash SSR. Token colors come from our own palette in
// preview.css (`.token.*`), not a stock Prism theme. The plugin CSS is safe to
// import statically (it only styles the language-picker dropdown).
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "./styles/toast.css";
import "./styles/toolbar.css";
import "./styles/preview.css";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import MarkdownDocs from "./components/MarkDownDocs";
import { getMarkdownStats } from "./lib/markdown-stats";
import { mdContent } from "./lib/content";
import { useMarkdownDoc } from "./hooks/useMarkdownDoc";
import { useCursorPosition } from "./hooks/useCursorPosition";

const INITIAL_VALUE = mdContent;

// Plain-text stats of the rendered HTML — mirrors usePreviewStats in
// markdown-editor (chars = text length, words, paragraphs = block count).
function getHtmlStats(html: string) {
  if (typeof window === "undefined") return { chars: 0, words: 0, paragraphs: 0 };
  const div = document.createElement("div");
  div.innerHTML = html;
  const plain = div.textContent ?? "";
  const chars = plain.length;
  const words = plain.trim() ? plain.trim().split(/\s+/).length : 0;
  const paragraphs = div.children.length;
  return { chars, words, paragraphs };
}

// Full-screen branded loading screen shown until the editor is ready — covers
// the IndexedDB read + editor-bundle download so the toolbar, editor and status
// bars never appear half-loaded (and there's no seed-text flash on reload).
// Swap the wordmark below for an <img> if you add a logo file to /public.
function AppLoading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white dark:bg-[#1e1e1e]">
      <span className="animate-loading-pulse text-[2.75rem] font-extrabold tracking-[-0.03em] text-[#111111] dark:text-[#f5f5f5]">
        codeitip
      </span>
    </div>
  );
}

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((m) => m.Editor),
  { ssr: false, loading: () => null }
);

// Status-bar styling (was status-bar.css). Dark mode keys off `.dark` on <html>
// via the `dark:` variant, so no per-state prop class is needed.
// Shares the preview pane's 3-color palette (surface #f3f3f3/#1e1e1e,
// line #dcdcdc/#3a3a3a, text black/white) — no extra hues introduced.
const STATUS_BAR =
  "flex grow shrink basis-1/2 min-w-0 items-center h-7 px-3 box-border overflow-hidden " +
  "select-none text-[11.5px] font-normal border-t bg-[#f3f3f3] border-[#dcdcdc] text-black/70 " +
  "dark:bg-[#1e1e1e] dark:border-[#3a3a3a] dark:text-white/70";
// First span = pane label (same text color, just heavier).
const STATUS_LABEL = "text-black/80 font-semibold text-[11px] mr-1 dark:text-white/85";
// Every following span gets a "|" separator before it (uses the line color).
const STATUS_STAT =
  "before:content-['|'] before:mx-2 before:font-light before:text-[#dcdcdc] dark:before:text-[#3a3a3a]";

export default function EditorPage() {
  const tuiRef = useRef<any>(null);
  const [tuiReady, setTuiReady] = useState(false);
  // Toast UI plugins, loaded client-side only (the Prism bundle needs `window`).
  // The editor is gated on this so code blocks are highlighted from first render.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plugins, setPlugins] = useState<any[] | null>(null);

  useEffect(() => {
    import(
      "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js"
    ).then((m) => setPlugins([m.default]));
  }, []);
  // Start light on both server and client to avoid a hydration mismatch, then
  // read the saved preference after mount (localStorage is browser-only).
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle Toast UI's own dark theme on the editor body. Called directly from
  // the toggle click and once from onLoad (so a theme restored from
  // localStorage is applied to the freshly-mounted editor without a click).
  

  useEffect(()=>{
        const root = document.querySelector(".editor-container .toastui-editor-defaultUI");
    root?.classList.toggle("toastui-editor-dark", darkMode);

  },[darkMode, tuiReady])

  // Whether the right-hand preview pane is shown (vertical split) or hidden.
  const [showPreview, setShowPreview] = useState(true);

  // Document state: load from IndexedDB on mount + debounced autosave on every
  // change, all owned by the hook (same as my-app's useMarkdownDoc).
  const { text, setText, hydrated, saveStatus } = useMarkdownDoc(INITIAL_VALUE);

  // Rendered-HTML stats for the second status bar.
  const stats = useMemo(() => getMarkdownStats(text), [text]);
  const [htmlStats, setHtmlStats] = useState({ chars: 0, words: 0, paragraphs: 0 });

  const handleChange = useCallback(() => {
    const inst = tuiRef.current?.getInstance();
    setText(inst?.getMarkdown() ?? "");
    setHtmlStats(getHtmlStats(inst?.getHTML() ?? ""));
  }, [setText]);

  // Live caret line/column for the status bar (1-based).
  const cursor = useCursorPosition(tuiRef, tuiReady);

  const exec = (cmd: string, payload?: Record<string, any>) => {
    const inst = tuiRef.current?.getInstance();
    if (!inst) return;
    inst.focus();
    inst.exec(cmd, payload);
  };

  const toggleTheme = () => {
    const next = !darkMode;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next.toString());
    setDarkMode(next);
  };

  const exportHtml = () => {
    const inst = tuiRef.current?.getInstance();
    if (!inst) return;
    const html = inst.getHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    alert("PDF export coming soon!");
  };

  // Toggle the right preview pane using Toast UI's built-in changePreviewStyle:
  // 'vertical' = side-by-side split (preview shown), 'tab' = single pane (hidden).
  const handleRightPane = () => {
    const inst = tuiRef.current?.getInstance();
    if (!inst) return;
    setShowPreview((prev) => {
      inst.changePreviewStyle(prev ? "tab" : "vertical");
      return !prev;
    });
  };

  return (
    <>
    {/* Logo screen covers the whole view (toolbar + editor + status bars)
        until the editor is fully ready. The editor still mounts underneath so
        it can load its bundle and read the saved doc. */}
    {!tuiReady && <AppLoading />}
    <div className="editor-container">
      <Toolbar
        exec={exec}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onExportHtml={exportHtml}
        onExportPdf={exportPdf}
        handleRightPane={handleRightPane}
      />
      <div style={{ height: "calc(100vh - 40px - 28px)" }}>
        {/* Render only once the saved doc is loaded and the syntax-highlight
            plugin is ready, so it goes straight in as initialValue (no seed-text
            flash) and code blocks are highlighted from the first render. */}
        {hydrated && plugins && (
          <Editor
            ref={tuiRef}
            initialValue={text}
            previewStyle="vertical"
            height="100%"
            initialEditType="markdown"
            hideModeSwitch={true}
            useCommandShortcut={true}
            usageStatistics={false}
            onChange={handleChange}
            plugins={plugins}
              previewHighlight={false}   // ← turns off the highlight

            onLoad={() => {
              setTuiReady(true);
              // Apply a theme restored from localStorage to the just-mounted editor.
              // applyEditorTheme(darkMode);
              // Populate the HTML status bar from the loaded document — handleChange
              // otherwise only fires on edit, leaving the HTML stats at 0/0/0 on load
              // while the Markdown stats already reflect the initial value.
              handleChange();
            }}
          />
        )}
      </div>

      <div className="flex shrink-0">
        <div className={STATUS_BAR}>
          <span className={STATUS_LABEL}>Markdown</span>
          <span className={STATUS_STAT}>{stats.bytes} bytes</span>
          <span className={STATUS_STAT}>{stats.words} words</span>
          <span className={STATUS_STAT}>{stats.lines} lines</span>
          <span className={STATUS_STAT}>Ln {cursor.line}, Col {cursor.col}</span>
          <span className={STATUS_STAT}>{saveStatus === "saving" ? "Saving…" : "Saved"}</span>
        </div>
        {/* Second bar gets the divider border between the two halves. */}
        <div className={`${STATUS_BAR} border-l`}>
          <span className={STATUS_LABEL}>HTML</span>
          <span className={STATUS_STAT}>{htmlStats.chars} characters</span>
          <span className={STATUS_STAT}>{htmlStats.words} words</span>
          <span className={STATUS_STAT}>{htmlStats.paragraphs} paragraphs</span>
        </div>
      </div>
    </div>

    <MarkdownDocs />
    </>
  );
}
