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


`;