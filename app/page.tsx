"use client";

import dynamic from "next/dynamic";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "./styles/toast.css";
import "./styles/toolbar.css";
import "./styles/status-bar.css";
import "./styles/preview.css";
import "./styles/loader.css";
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
function AppLoading({ dark }: { dark: boolean }) {
  return (
    <div className={`app-loading${dark ? " app-loading-dark" : ""}`}>
      <span className="app-loading-logo">codeitip</span>
    </div>
  );
}

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((m) => m.Editor),
  { ssr: false, loading: () => null }
);

export default function EditorPage() {
  const tuiRef = useRef<any>(null);
  const [tuiReady, setTuiReady] = useState(false);
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
  const applyEditorTheme = (dark: boolean) => {

  };

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
    applyEditorTheme(next);
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
    {!tuiReady && <AppLoading dark={darkMode} />}
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
        {/* Render only once the saved doc is loaded, so it goes straight in as
            initialValue (no seed-text flash). */}
        {hydrated && (
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
              previewHighlight={false}   // ← turns off the highlight

            onLoad={() => {
              setTuiReady(true);
              // Apply a theme restored from localStorage to the just-mounted editor.
              applyEditorTheme(darkMode);
              // Populate the HTML status bar from the loaded document — handleChange
              // otherwise only fires on edit, leaving the HTML stats at 0/0/0 on load
              // while the Markdown stats already reflect the initial value.
              handleChange();
            }}
          />
        )}
      </div>

      <div className="editor-statusbars">
        <div className={`status-bar ${darkMode ? "status-bar-darkmode" : ""}`}>
          <span>Markdown</span>
          <span>{stats.bytes} bytes</span>
          <span>{stats.words} words</span>
          <span>{stats.lines} lines</span>
          <span>Ln {cursor.line}, Col {cursor.col}</span>
          <span>{saveStatus === "saving" ? "Saving…" : "Saved"}</span>
        </div>
        <div className={`status-bar ${darkMode ? "status-bar-darkmode" : ""}`}>
          <span>HTML</span>
          <span>{htmlStats.chars} characters</span>
          <span>{htmlStats.words} words</span>
          <span>{htmlStats.paragraphs} paragraphs</span>
        </div>
      </div>
    </div>

    <MarkdownDocs />
    </>
  );
}
