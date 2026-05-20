// Pure computation: byte/word/line counts of a Markdown string.
// Not a hook (no React state), but lives in /hooks for discoverability since
// it's the natural pair to usePreviewStats. Returns a plain object.
export function getMarkdownStats(text: string) {
  const bytes = new Blob([text]).size;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split("\n").length;
  return { bytes, words, lines };
}
