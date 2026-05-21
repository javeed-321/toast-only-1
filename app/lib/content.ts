export const mdContent = `# my-app — Product Documentation

A browser-based Markdown editor with live WYSIWYG preview, offline persistence,
and one-click export to HTML / PDF. Built on Next.js 16 + React 19.

---

## 1. Overview

**my-app** is a two-pane Markdown workspace inspired by tools like StackEdit,
but rebuilt on a modern React stack and intentionally scoped down to the
features writers actually use day-to-day.

- **Left pane** — Markdown source editor (Toast UI Editor)
- **Right pane** — Rich-text rendered preview (Tiptap + ProseMirror)
- **Autosave** — Every keystroke is debounced and persisted to IndexedDB
- **Export** — Self-contained HTML or print-ready PDF, no server round-trip

Everything runs entirely in the browser. There is no backend, no account, and
no network requirement after the first page load.

---

## 2. Product Design

### 2.1 Target user

Technical writers, developers, students, and engineers who:

- Write in Markdown but want to *see* the output as they type
- Need math (KaTeX), code highlighting, tables, task lists, and embeds
- Want their work saved automatically, even if the tab is closed
- Need to ship the result as a clean HTML or PDF document

### 2.2 Design principles

| Principle | What it means in the product |
|---|---|
| **Source first** | Markdown is the source of truth. The preview is derived, never the other way around. |
| **Zero setup** | Open the page, start typing. No login, no install, no config. |
| **Local-first** | The document lives in the user's browser (IndexedDB). The user owns it. |
| **Frictionless export** | One button for HTML, one for PDF. No print-CSS surprises. |
| **WYSIWYG without lying** | The preview shows what the exported document will look like — same fonts, same code theme, same math rendering. |

### 2.3 Feature surface

**Editing (left pane — Toast UI)**
- Markdown source with syntax highlighting
- Keyboard shortcuts (bold, italic, headings, lists, etc.)
- Live caret tracking (Ln / Col reported in the status bar)
- Spellcheck / autocorrect disabled to avoid noisy underlines in source

**Preview (right pane — Tiptap)**
- Headings, paragraphs, emphasis, blockquotes, horizontal rules
- Ordered / unordered / **task** lists (nested)
- Tables (full TableKit)
- Inline and fenced code with **syntax highlighting** (highlight.js via lowlight, ~35 languages)
- **Math** (inline and block, KaTeX)
- **Highlight** (\`==text==\`)
- **Details/summary** collapsibles
- **Images**
- **YouTube** and **Twitch** embeds
- **Mentions**

**Persistence**
- IndexedDB-backed autosave (~100 ms debounce)
- Status bar shows live \`Saving…\` / \`Saved\` state
- Document survives tab close, browser restart, and offline reloads

**Export**
- **Export HTML** — single self-contained file with embedded styles, KaTeX and highlight.js loaded from CDN
- **Export PDF** — same HTML routed through the browser's native print pipeline; no server, no PDF library

**Status bar**
- Markdown side: bytes, words, lines, cursor position, save state
- Preview side: characters, words, paragraphs, export buttons

### 2.4 Synchronized scrolling

The two panes scroll proportionally — scrolling the source pane scrolls the
preview pane to the same relative position, and vice versa. Implemented with
a re-entrancy guard so neither pane can fight the other.

### 2.5 UX layout

\`\`\`
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌─────────────── Markdown ──────────┐  ┌──── Preview ────┐  │
│  │                                   │  │                 │  │
│  │   # Heading                       │  │   Heading       │  │
│  │   Some **bold** text.             │  │   Some bold     │  │
│  │                                   │  │   text.         │  │
│  │   - [ ] task                      │  │   ☐ task        │  │
│  │   - [x] done                      │  │   ☑ done        │  │
│  │                                   │  │                 │  │
│  │                                   │  │                 │  │
│  ├───────────────────────────────────┤  ├─────────────────┤  │
│  │ 532 bytes  98 words  Ln 12, Col 4 │  │ 412 chars  Saved│  │
│  │                                   │  │ [HTML] [PDF]    │  │
│  └───────────────────────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
\`\`\`

---

## 3. Development

### 3.1 Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.2.6** (App Router) | React 19 support, file-based routing, fast dev server |
| UI runtime | **React 19.2.4** | Concurrent rendering, modern hooks |
| Language | **TypeScript 5** | Type safety across editor / DB / export boundaries |
| Markdown source editor | **Toast UI Editor 3.2** | Mature, free, ships with Markdown-mode caret events |
| Rich preview engine | **Tiptap 3.23 + ProseMirror** | Modular extensions, structured document model, easy to render markdown into |
| Code highlighting | **highlight.js + lowlight** | Standard themes (GitHub light), tree-friendly API for Tiptap |
| Math | **KaTeX 0.16** | Fast, no MathJax weight, deterministic output |
| Diagrams (available) | **Mermaid 11** | Optional, for sequence/flow diagrams |
| Local storage | **idb 8** (IndexedDB wrapper) | Async, larger quota than localStorage, structured records |
| Styling | **Tailwind CSS 4** + custom CSS modules | Utility-first plus tight overrides for the editor surfaces |
| Fonts | **Lato** via \`next/font/google\` | Self-hosted, no FOUT |

### 3.2 Project layout

\`\`\`
my-app/
├── app/
│   ├── layout.tsx              # Root layout, loads Toast UI base CSS
│   ├── page.tsx                # Mounts <MarkdownEditor />
│   ├── globals.css
│   ├── components/
│   │   ├── TipTapEditor.tsx    # ← main editor component (Toast UI + Tiptap)
│   │   ├── MarkdownEditor.tsx  # earlier prototype (kept for reference)
│   │   ├── content.ts          # seed/demo markdown
│   │   ├── markDownCommands.ts # toolbar command helpers
│   │   └── styles/             # response.css, toast.css, tiptap.css,
│   │                           # toolbar.css, status-bar.css, styles.css
│   └── lib/
│       ├── db.ts               # IndexedDB load / save (single-doc mode)
│       └── export.ts           # buildStandaloneHtml + exportHtml/exportPdf
├── public/
├── package.json
├── next.config.ts
├── tsconfig.json
└── eslint.config.mjs
\`\`\`

### 3.3 Architecture

\`\`\`
        ┌────────────────────────────────────────────────────┐
        │                  MarkdownEditor                    │
        │                                                    │
        │   ┌─────────────────┐         ┌──────────────────┐ │
        │   │  Toast UI       │  text   │   Tiptap         │ │
        │   │  (markdown      │ ──────▶ │   (preview,      │ │
        │   │   source)       │ debounce│    extensions)   │ │
        │   └──────┬──────────┘  ~25ms  └────────┬─────────┘ │
        │          │                              │           │
        │          │ debounce 100ms               │ getHTML() │
        │          ▼                              ▼           │
        │   ┌─────────────┐               ┌─────────────────┐ │
        │   │ IndexedDB   │               │ export.ts       │ │
        │   │ (idb)       │               │ HTML / PDF      │ │
        │   └─────────────┘               └─────────────────┘ │
        └────────────────────────────────────────────────────┘
\`\`\`

**Data flow**

1. User types in Toast UI. \`onChange\` reads \`getMarkdown()\` and updates React state (\`text\`).
2. A 100 ms debounced effect writes \`text\` to IndexedDB via \`saveCurrentDoc()\`.
3. A 25 ms debounced effect calls \`editor.commands.setContent(text, { contentType: "markdown" })\` on the Tiptap instance, re-rendering the preview.
4. On mount, \`loadCurrentDoc()\` hydrates \`text\` from IndexedDB (or falls back to demo content).
5. Export buttons take \`editor.getHTML()\`, wrap it in a standalone HTML template (\`buildStandaloneHtml\`), and either download it as \`.html\` or open it in a hidden iframe and trigger \`window.print()\`.

### 3.4 Key implementation details

**Client-only mounting.** Toast UI touches \`Element\` at module load, so it is
imported via \`next/dynamic({ ssr: false })\`. The whole component is marked
\`"use client"\`.

**Hydration guard.** The editor renders \`Loading…\` until the IndexedDB read
resolves. This prevents the autosave effect from overwriting the saved
document with an empty string on first render.

**Caret tracking.** Toast UI's \`caretChange\` event doesn't fire for every
arrow-key move, so the component also listens to the native
\`document.selectionchange\` event for reliable Ln/Col updates.

**Synchronized scrolling.** Uses a \`requestAnimationFrame\` retry loop to
attach to the Toast UI scroll surface once it exists, then proportional
mapping (\`scrollTop / scrollMax\`) between the two panes, with an \`isSyncing\`
flag to break the feedback loop.

**Spellcheck off.** Toast UI's ProseMirror surface gets \`spellcheck\`,
\`autocorrect\`, \`autocapitalize\`, and \`autocomplete\` set to \`off\` after each
content change so red squiggles don't litter the Markdown source.

**Code blocks.** \`CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" })\`
gives ~35 languages highlighted with the GitHub light theme (matching the export stylesheet).

### 3.5 Persistence schema (IndexedDB)

\`\`\`
Database:    mdx-editor   (version 1)
Object store: docs        (keyPath: "id")

Record shape:
  {
    id: "current",      // single-doc mode for now
    body: string,       // raw markdown
    updatedAt: number   // Date.now()
  }
\`\`\`

Single-document mode keeps the surface tiny. Multi-doc support is a
straightforward extension — add a list view and key records by a generated id.

### 3.6 Export pipeline

1. \`editor.getHTML()\` returns the rendered Tiptap HTML.
2. \`buildStandaloneHtml()\` injects it into a complete HTML document with:
   - GitHub-style typography
   - KaTeX CSS (CDN)
   - highlight.js CSS — GitHub light theme (CDN), identical to the preview
   - Print-friendly \`@media print { @page { margin: 1in } ... }\` rules
3. **HTML export** — Blob → object URL → trigger anchor download.
4. **PDF export** — write the HTML into a hidden iframe, wait briefly for
   CDN stylesheets, then call \`iframe.contentWindow.print()\`. The browser's
   native print-to-PDF produces the final file. No PDF library, no fonts to
   bundle, perfect text selection in the output.

### 3.7 Running locally

\`\`\`bash
cd my-app
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
\`\`\`

Requires Node 20+.

---

## 4. Comparison with StackEdit

StackEdit (stackedit.io) is the closest spiritual reference — it is the
canonical "Markdown editor in your browser." The table below maps **my-app**
against it.

### 4.1 At a glance

| Dimension | **my-app** | **StackEdit** |
|---|---|---|
| Year of stack | 2025–2026 | 2013, last major refactor ~2018 |
| Frontend framework | Next.js 16 (App Router) + React 19 | Vue 2 |
| Build system | Next.js / Turbopack | Webpack + Gulp |
| Source editor | Toast UI Editor (ProseMirror-based) | PageDown / CodeMirror-derived |
| Preview engine | Tiptap (ProseMirror) | Custom markdown-it pipeline |
| Markdown flavor | CommonMark + GFM (tables, task lists), KaTeX math, highlight.js code | CommonMark + GFM, KaTeX/MathJax, Prism |
| WYSIWYG mode | Preview pane is rich-text & editable | Preview pane is HTML only (separate WYSIWYG mode behind toggle) |
| Local persistence | IndexedDB (idb) | IndexedDB (custom layer) |
| Cloud sync | ❌ none (local-first by design) | ✅ Google Drive, Dropbox, GitHub, GitLab, WordPress, CouchDB |
| Publishing | ❌ | ✅ Blogger, WordPress, Zendesk, etc. |
| Export HTML | ✅ self-contained, one click | ✅ |
| Export PDF | ✅ via browser print pipeline | ✅ (paid API in hosted version) |
| Diagrams | Mermaid available | Mermaid + UML |
| Embeds | YouTube, Twitch, images, mentions | Images |
| Offline | ✅ everything is client-side | ✅ |
| Auth / accounts | ❌ not needed | Optional (for sync) |
| Bundle weight | Small (modern tree-shaken React) | Larger (legacy Vue 2 + many integrations) |
| Codebase size | ~10 source files in \`app/\` | Hundreds of files in \`src/\` |
| License | Internal / proprietary | Apache 2.0 |

### 4.2 Where my-app is intentionally smaller

StackEdit is a feature-complete publishing platform: cloud sync, blog
publishing, workspaces, comments, revisions, multi-document folders. **my-app
ships none of that.** It is a focused single-document editor.

That is a deliberate scoping choice:
- No accounts means no auth surface to maintain.
- No cloud sync means no OAuth secrets, no provider quotas, no rate limits.
- Local-first IndexedDB means the user owns their data and there is no
  privacy story to defend.

### 4.3 Where my-app improves on StackEdit

- **Modern stack.** React 19 + Next.js 16 + TypeScript vs. Vue 2 + Webpack.
  Faster dev loop, smaller production bundle, full type safety.
- **Live rich-text preview.** The right pane is a real Tiptap editor, not a
  static HTML render. The exported HTML matches what the user sees because
  it *is* what the user sees.
- **First-class embeds.** YouTube, Twitch, mentions, details/summary
  collapsibles, and task lists come in as Tiptap extensions rather than
  bespoke Markdown plugins.
- **Cleaner export.** PDF export uses the browser's print engine — no extra
  server, no paid PDF API, perfect text selection in the output.
- **No analytics, no telemetry, no third-party scripts** beyond the CDN
  stylesheets used in the exported document.

### 4.4 Where StackEdit is still ahead

- Cloud sync and cross-device editing.
- Direct publishing to blog platforms.
- A much larger Markdown extension catalog accumulated over a decade.
- Community, documentation, plugin ecosystem.

### 4.5 Summary

> **my-app** is a focused, modern, local-first Markdown editor. It covers the
> 80% of StackEdit that writers actually use every day, rebuilt on a current
> React stack with a better-looking live preview and cleaner export, while
> deliberately leaving out the cloud-sync and publishing surface that
> StackEdit's complexity comes from.

---

## 5. Roadmap (suggested next steps)

1. **Multi-document support** — list view, document switcher, rename, delete.
2. **Import** — drag-and-drop \`.md\` files into the editor.
3. **Theme switcher** — light / dark for both panes.
4. **Mermaid + UML rendering in preview** (dependency already installed).
5. **Optional cloud sync** behind a feature flag (Google Drive or GitHub Gist).
6. **PWA shell** — installable, fully offline first-load.
7. **Shareable links** — encode the document in the URL hash for read-only sharing.

---

## 6. Credits / third-party

- [Next.js](https://nextjs.org), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org)
- [Toast UI Editor](https://ui.toast.com/tui-editor) — Markdown source editor
- [Tiptap](https://tiptap.dev) / [ProseMirror](https://prosemirror.net) — rich preview
- [highlight.js](https://highlightjs.org) + [lowlight](https://github.com/wooorm/lowlight) — code highlighting
- [KaTeX](https://katex.org) — math
- [Mermaid](https://mermaid.js.org) — diagrams
- [idb](https://github.com/jakearchibald/idb) — IndexedDB wrapper
- [Tailwind CSS](https://tailwindcss.com)
- Inspired by [StackEdit](https://stackedit.io) (Apache 2.0)

---

## 7. Diagrams

Diagrams use a \`$$uml\` block (rendered with PlantUML):

$$uml
@startuml
Writer -> Editor: Type Markdown
Editor -> Preview: Live render
Preview --> Writer: HTML / PDF
@enduml
$$
`;