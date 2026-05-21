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
import { useCursorPosition } from "./hooks/useCursorPosition";
import StatusBar from "./components/StatusBar";
import ScrollToggle from "./components/ScrollToggle";
import { Skeleton } from "@/components/ui/skeleton";
import { exportHtml, exportPdf } from "./lib/utils";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setBody } from "./store/docSlice";

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

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((m) => m.Editor),
  { ssr: false, loading: () => null }
);

// Lightweight placeholder shown in the editor pane while the editor bundle and
// highlight plugin load, so the area isn't blank on refresh. A few shimmering
// lines in the editor surface palette — no branded splash. Uses shadcn Skeleton
// (its base `bg-accent`/`rounded-md` are overridden here to keep the original
// faint black/white lines and 4px radius).
function EditorSkeleton() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col gap-3 p-6 bg-white dark:bg-[#1e1e1e]">
      {[92, 70, 84, 60, 78, 45].map((w, i) => (
        <Skeleton
          key={i}
          className="h-3.5 rounded bg-black/10 dark:bg-white/10"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

export default function EditorPage() {
  const tuiRef = useRef<any>(null);
  const [tuiReady, setTuiReady] = useState(false);
  // Document body lives in Redux (persisted to localStorage via redux-persist),
  // replacing the old idb-backed store. `initialBody` captures the rehydrated
  // value once for the editor's initialValue; live edits flow back via dispatch.
  const dispatch = useAppDispatch();
  // The seed doc applies via the slice's initialState on a fresh, unpersisted
  // load. An empty/whitespace body would trigger Toast UI's empty-state
  // ("Write"/"Preview") on reload, so coerce it to a single space.
  const text = useAppSelector((state) => state.doc.body);
  const initialBodyRef = useRef(text.trim() ? text : " ");
  // Toast UI plugins, loaded client-side only (the Prism bundle needs `window`).
  // The editor is gated on this so code blocks are highlighted from first render.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plugins, setPlugins] = useState<any[] | null>(null);

  useEffect(() => {
    // Use the 40 KB base highlight plugin and register only the languages we
    // need, instead of the 725 KB `-all` bundle (which ships ~280 languages).
    // Prism's language components extend a *global* `Prism`, so we expose it on
    // window before importing them, in dependency order.
    (async () => {
      const prismMod = await import("prismjs");
      const Prism = prismMod.default ?? prismMod;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Prism = Prism;
      // markup (html/xml), clike and css have no prerequisites.
      await import("prismjs/components/prism-markup");
      await import("prismjs/components/prism-clike");
      await import("prismjs/components/prism-css");
      await import("prismjs/components/prism-javascript"); // needs clike
      await import("prismjs/components/prism-typescript"); // needs javascript
      await import("prismjs/components/prism-jsx"); // needs markup + javascript
      await import("prismjs/components/prism-tsx"); // needs jsx + typescript
      await import("prismjs/components/prism-java"); // needs clike
      await import("prismjs/components/prism-c"); // needs clike
      await import("prismjs/components/prism-cpp"); // needs c
      await import("prismjs/components/prism-go"); // needs clike
      await import("prismjs/components/prism-rust");
      await import("prismjs/components/prism-sql");
      await import("prismjs/components/prism-json");
      await import("prismjs/components/prism-bash");
      await import("prismjs/components/prism-python");
      await import("prismjs/components/prism-yaml");
      await import("prismjs/components/prism-markdown"); // needs markup
      const codeSyntaxHighlight = (
        await import("@toast-ui/editor-plugin-code-syntax-highlight")
      ).default;
      setPlugins([[codeSyntaxHighlight, { highlighter: Prism }]]);
    })();
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

  // Below `lg`, the two panes can't sit side by side, so we show one at a time.
  // This drives the `data-mview` attribute the responsive CSS keys off (see
  // toast.css). On desktop the attribute is present but ignored — the real
  // split is controlled by Toast UI's previewStyle instead.
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  // Document state: load from IndexedDB on mount + debounced autosave on every
  // change, all owned by the hook (same as my-app's useMarkdownDoc).

  // Rendered-HTML stats for the second status bar.
  const stats = useMemo(() => getMarkdownStats(text), [text]);
  const [htmlStats, setHtmlStats] = useState({ chars: 0, words: 0, paragraphs: 0 });


  

  // Debounce the persist/stats work so it runs once after typing pauses, not on
  // every keystroke. The editor itself stays the live source of truth; this only
  // controls how often we re-serialize the doc, dispatch to Redux (→ IndexedDB
  // write) and recompute stats.
  const persistRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(() => {
    const inst = tuiRef.current?.getInstance();
    if (!inst) return;
    if (persistRef.current) clearTimeout(persistRef.current);
    persistRef.current = setTimeout(() => {
      // Never persist an empty document: a blank body makes Toast UI show its
      // empty-state ("Write"/"Preview") on reload. Store a single space instead.
      const md = inst.getMarkdown();
      console.log(md)
      dispatch(setBody(md.trim() ? md : " "));
      setHtmlStats(getHtmlStats(inst.getHTML() ?? ""));
    }, 300);
  }, [dispatch]);

  // Clear any pending debounced write when the component unmounts.
  useEffect(() => {
    return () => {
      if (persistRef.current) clearTimeout(persistRef.current);
    };
  }, []);

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
const getEditorHtml = () => tuiRef.current?.getInstance()?.getHTML() ?? "";

  useEffect(()=>{
                    tuiRef.current?.getInstance()?.moveCursorToEnd(true);

  },[tuiReady,tuiRef])

  return (
    <>
    <div className="editor-container" data-mview={mobileView}>
      <Toolbar
        exec={exec}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onExportHtml={() => exportHtml({ tuiRef })}
        handleRightPane={handleRightPane}
        mobileView={mobileView}
        onMobileView={setMobileView}
      />
      <div className="relative" style={{ height: "calc(100vh - 40px - 28px)" }}>
        {/* Skeleton covers the pane until the editor has mounted and painted
            (its bundle + the highlight plugin both have to load first). */}
        {!tuiReady && <EditorSkeleton />}
        {/* Render only once the saved doc is loaded and the syntax-highlight
            plugin is ready, so it goes straight in as initialValue (no seed-text
            flash) and code blocks are highlighted from the first render. */}
        { plugins && (
          <Editor
            ref={tuiRef}
            initialValue={initialBodyRef.current}
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
              if (initialBodyRef.current.trim()) {
                // Double rAF: the first frame lets ProseMirror commit the
                // initial document, the second runs after it has painted, so
                // the caret lands on real content instead of an empty doc.
                // requestAnimationFrame(() =>
                //   requestAnimationFrame(() => {
                //     tuiRef.current?.getInstance()?.moveCursorToEnd(true);
                //   })
                // );
              }
            }}
          />
        )}
        <ScrollToggle ready={tuiReady} />
      </div>

<StatusBar
  stats={stats}
  htmlStats={htmlStats}
  cursor={cursor}
  onExportHtml={() => exportHtml({ tuiRef })}

  
  onExportPdf={() => exportPdf({ html: getEditorHtml(), title: "document" })}

/>    
        
        
        </div>

    <MarkdownDocs />
    </>
  );
}
