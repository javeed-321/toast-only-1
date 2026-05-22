export const mdContent = `# my-app — Markdown Editor

A browser-based Markdown editor with live WYSIWYG preview, offline persistence, and one-click export to HTML/PDF. Built on Next.js 16 + React 19.

---

## Overview

Two-pane Markdown workspace — source editor (Toast UI) on the left, rich-text preview (Tiptap) on the right. Autosaves to IndexedDB. Exports to self-contained HTML or print-ready PDF. Fully client-side, no backend, no account required.

---

## Target User

Technical writers, developers, students, and engineers who write in Markdown and want live preview, math/code support, automatic saving, and clean exports.

---

## Design Principles

- **Source first** — Markdown is the source of truth
- **Zero setup** — Open and start typing
- **Local-first** — Document lives in the browser (IndexedDB)
- **Frictionless export** — One button for HTML, one for PDF
- **WYSIWYG without lying** — Preview matches the exported document exactly

---

## Features

**Editor:** Markdown syntax highlighting, keyboard shortcuts, caret tracking (Ln/Col), spellcheck disabled for clean source view.

**Preview:** Headings, lists (including task lists), tables, code highlighting (~35 languages), KaTeX math, highlight marks, details/summary, images, YouTube/Twitch embeds, mentions.

**Persistence:** IndexedDB autosave (~100ms debounce), survives tab close and browser restart.

**Export:** Self-contained HTML download or PDF via browser print pipeline — no server needed.

**Synced scrolling:** Proportional scroll between panes with re-entrancy guard.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Source editor | Toast UI Editor 3.2 |
| Preview engine | Tiptap 3.23 + ProseMirror |
| Code highlighting | highlight.js + lowlight |
| Math | KaTeX 0.16 |
| Diagrams | Mermaid 11 |
| Storage | idb 8 (IndexedDB) |
| Styling | Tailwind CSS 4 + CSS modules |
| Fonts | Lato via next/font/google |

---

## Architecture

\`\`\`
User types → Toast UI (onChange) → React state (text)
  ├─ 100ms debounce → IndexedDB save
  └─ 25ms debounce  → Tiptap setContent (preview render)

On mount → IndexedDB load → hydrate editor (fallback: demo content)
Export   → Tiptap getHTML → standalone HTML template → download or print
\`\`\`

---

## Key Implementation Details

- **Client-only:** Toast UI imported via \`next/dynamic({ ssr: false })\`
- **Hydration guard:** Shows "Loading…" until IndexedDB resolves to prevent empty overwrites
- **Caret tracking:** Uses \`selectionchange\` event alongside Toast UI's \`caretChange\`
- **Synced scroll:** \`requestAnimationFrame\` retry loop + proportional mapping + \`isSyncing\` flag
- **Spellcheck off:** Attributes set to \`off\` on Toast UI's ProseMirror surface after each change

---

## IndexedDB Schema

\`\`\`
Database: mdx-editor (v1)
Store: docs (keyPath: "id")
Record: { id: "current", body: string, updatedAt: number }
\`\`\`

Single-document mode. Multi-doc is a straightforward extension.

---

## Export Pipeline

1. \`editor.getHTML()\` → rendered Tiptap HTML
2. \`buildStandaloneHtml()\` → wraps in full HTML with GitHub typography, KaTeX CSS, highlight.js theme
3. **HTML:** Blob → object URL → anchor download
4. **PDF:** Hidden iframe → write HTML → \`window.print()\` → browser's native print-to-PDF

---

## vs StackEdit

| | my-app | StackEdit |
|---|---|---|
| Stack | Next.js 16 + React 19 | Vue 2 + Webpack |
| Preview | Live Tiptap (rich-text) | Static HTML render |
| Cloud sync | ❌ (local-first by design) | ✅ Google Drive, Dropbox, GitHub |
| Publishing | ❌ | ✅ Blogger, WordPress, etc. |
| PDF export | Free (browser print) | Paid API |
| Embeds | YouTube, Twitch, mentions | Images only |

**my-app wins on:** modern stack, live rich-text preview, cleaner export, no telemetry.

**StackEdit wins on:** cloud sync, blog publishing, plugin ecosystem, community.

---

## Roadmap

1. Multi-document support
2. Drag-and-drop .md import
3. Light/dark theme switcher
4. Mermaid/UML rendering in preview
5. Optional cloud sync (Google Drive / GitHub Gist)
6. PWA shell for full offline
7. Shareable links via URL hash

---

## Running Locally

\`\`\`bash
cd my-app
npm install
npm run dev
npm run build
\`\`\`

Requires Node 20+.
`;