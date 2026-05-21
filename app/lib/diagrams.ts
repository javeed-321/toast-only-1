// Math (KaTeX) support for the Toast UI Editor preview.
//
// Diagrams are handled by the official `@toast-ui/editor-plugin-uml` (PlantUML)
// via `$$uml … $$` custom blocks — no custom code needed there.
//
// Math is different: users type the *standard* LaTeX delimiters in ordinary
// text — `$…$` / `\(…\)` (inline) and `$$…$$` / `\[…\]` (display) — which are
// NOT Toast UI custom blocks, so a `toHTMLRenderers` plugin can't catch them.
// We render math client-side after each preview update with KaTeX's official
// auto-render extension, which scans the preview's text nodes.

/* eslint-disable @typescript-eslint/no-explicit-any */

// `$$` is listed before `$` so display math is matched before inline. KaTeX
// auto-render skips <pre>/<code>/<script> by default, so shell `$VAR` inside
// code blocks is left alone.
export const mathDelimiters = [
  { left: "$$", right: "$$", display: true },
  { left: "\\[", right: "\\]", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
];

// A paragraph whose entire text is one `$$ … $$` block.
const DISPLAY_BLOCK = /^\$\$[\s\S]+\$\$$/;

// Render all math in `root`. Idempotent: once auto-render replaces the `$…$`
// delimiters with KaTeX markup, a repeat pass (e.g. from the preview
// MutationObserver reacting to our own changes) finds nothing left to do.
export function renderMath(root: HTMLElement, renderMathInElement: any): void {
  // Toast UI renders soft line breaks as <br>, so a multi-line `$$\n … \n$$`
  // block becomes one <p> whose `$$` markers sit in separate text nodes —
  // KaTeX auto-render is text-node-bound and can't pair them. For any paragraph
  // that is entirely a `$$ … $$` block, collapse its <br>-split nodes into a
  // single text node so auto-render sees the whole block at once.
  root.querySelectorAll("p").forEach((p) => {
    const text = (p.textContent ?? "").trim();
    if (text.length > 4 && DISPLAY_BLOCK.test(text)) {
      p.textContent = text;
    }
  });

  // Inline `$…$` and display `$$…$$` (now single-text-node) via auto-render.
  try {
    renderMathInElement(root, {
      delimiters: mathDelimiters,
      throwOnError: false,
    });
  } catch {
    /* auto-render is resilient with throwOnError:false; ignore stray failures */
  }
}
