 export const exportHtml = ({ tuiRef }: { tuiRef: React.RefObject<any> }) => {
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

  const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

function buildStandaloneHtml({
  html,
  title = "Document",
  wrapCode = true,
}: ExportOptions): string {
  const codeWrapCss = wrapCode
    ? "white-space: pre-wrap; word-break: break-word;"
    : "white-space: pre;";
  const preOverflow = wrapCode ? "visible" : "auto";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css" />
<style>
  :root { color-scheme: light; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    max-width: 820px;
    margin: 0 auto;
    padding: 40px 80px;
    line-height: 1.6;
    color: #24292f;
    background: #fff;
  }
  h1, h2, h3, h4, h5, h6 { margin: 1.2em 0 0.5em; font-weight: 700; line-height: 1.25; }
  h1 { font-size: 2rem;   border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
  h2 { font-size: 1.5rem; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
  h3 { font-size: 1.25rem; }
  p { margin: 0.6em 0; }
  a { color: #0969da; }
  strong { font-weight: 700; }
  em { font-style: italic; }
  code:not(pre code) {
    padding: 0.2em 0.4em;
    background: rgba(175, 184, 193, 0.2);
    border-radius: 6px;
    font-size: 85%;
    font-family: ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;
  }
  pre {
    padding: 16px;
    background: #f6f8fa;
    border-radius: 6px;
    overflow: ${preOverflow};
    margin: 0.8em 0;
  }
  pre code {
    font-family: ui-monospace, SFMono-Regular, Consolas, Menlo, monospace;
    font-size: 85%;
    background: transparent;
    padding: 0;
    ${codeWrapCss}
  }
  blockquote {
    margin: 0.8em 0;
    padding: 0 1em;
    color: #57606a;
    border-left: 4px solid #d0d7de;
  }
  table { border-collapse: collapse; margin: 0.8em 0; }
  table th, table td { border: 1px solid #d0d7de; padding: 6px 13px; }
  table th { background: #f6f8fa; font-weight: 600; }
  ul, ol { padding-left: 2em; margin: 0.5em 0; }
  ul[data-type="taskList"] { list-style: none; padding-left: 0; }
  ul[data-type="taskList"] li { display: flex; gap: 8px; align-items: flex-start; }
  img { max-width: 100%; }
  hr { border: 0; border-top: 1px solid #d0d7de; margin: 1.5em 0; }
  mark { background: #fef08a; padding: 0 2px; border-radius: 2px; }
  details {
    margin: 0.5em 0;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }
  details summary { cursor: pointer; font-weight: 600; }

  @media print {
    @page { margin: 1in; }
    body { max-width: none; padding: 0; }
    pre, blockquote, table, img { page-break-inside: avoid; }
    h1, h2, h3 { page-break-after: avoid; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
${html}
</body>
</html>`;
}

type ExportOptions = {
  html: string;
  title?: string;
  wrapCode?: boolean;
};

  export function exportPdf(options: ExportOptions): void {
  const fullHtml = buildStandaloneHtml(options);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(fullHtml);
  doc.close();

  const triggerPrint = () => {
    // Small delay to let CDN stylesheets (katex, hljs) finish applying.
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        // Keep the iframe alive briefly after the print dialog opens —
        // some browsers tear down the print job if the iframe goes away
        // too early. Then clean up.
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 1500);
      }
    }, 400);
  };

  if (iframe.contentWindow?.document.readyState === "complete") {
    triggerPrint();
  } else {
    iframe.addEventListener("load", triggerPrint, { once: true });
  }
}