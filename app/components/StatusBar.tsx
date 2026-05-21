"use client";

import { FileCode, FileText } from "lucide-react";
import { exportPdf } from "../lib/utils";

type StatusBarProps = {
  stats: { bytes: number; words: number; lines: number };
  htmlStats: { chars: number; words: number; paragraphs: number };
  cursor: { line: number; col: number };
  saveStatus?: "Saved" | "Saving";
  onExportHtml: () => void;
  onExportPdf: () => void;
};
// export function exportPdf(options: ExportOptions): void {
//   const fullHtml = buildStandaloneHtml(options);

//   const iframe = document.createElement("iframe");
//   iframe.style.position = "fixed";
//   iframe.style.right = "0";
//   iframe.style.bottom = "0";
//   iframe.style.width = "0";
//   iframe.style.height = "0";
//   iframe.style.border = "0";
//   document.body.appendChild(iframe);

//   const doc = iframe.contentDocument || iframe.contentWindow?.document;
//   if (!doc) {
//     document.body.removeChild(iframe);
//     return;
//   }
//   doc.open();
//   doc.write(fullHtml);
//   doc.close();

//   const triggerPrint = () => {
//     // Small delay to let CDN stylesheets (katex, hljs) finish applying.
//     setTimeout(() => {
//       try {
//         iframe.contentWindow?.focus();
//         iframe.contentWindow?.print();
//       } finally {
//         // Keep the iframe alive for a moment after print dialog opens,
//         // some browsers need it. Then clean up.
//         setTimeout(() => {
//           if (iframe.parentNode) document.body.removeChild(iframe);
//         }, 1500);
//       }
//     }, 400);
//   };

//   if (iframe.contentWindow?.document.readyState === "complete") {
//     triggerPrint();
//   } else {
//     iframe.addEventListener("load", triggerPrint, { once: true });
//   }
// }

export default function StatusBar({
  stats,
  htmlStats,
  cursor,
  saveStatus = "Saving",
  onExportHtml,
      onExportPdf

}: StatusBarProps) {
  const STATUS_BAR =
    "flex grow shrink basis-1/2 min-w-0 items-center h-7 px-3 box-border overflow-hidden " +
    "select-none text-[11.5px] font-normal border-t bg-[#f3f3f3] border-[#dcdcdc] text-black/70 " +
    "dark:bg-[#1e1e1e] dark:border-[#3a3a3a] dark:text-white/70";
  const STATUS_LABEL =
    "text-black/80 font-semibold text-[11px] mr-1 dark:text-white/85";
  const STATUS_STAT =
    "before:content-['|'] before:mx-2 before:font-light before:text-[#dcdcdc] dark:before:text-[#3a3a3a]";

  // Compact text-button — lives inside the h-7 bar without breaking rhythm.
  // Same three-color palette as the rest of the status bar (no new hues),
  // just a faint hover wash for affordance.
  const STATUS_BUTTON =
    "inline-flex items-center gap-1 h-5 px-2 rounded text-[11px] font-medium " +
    "text-black/75 hover:bg-black/5 hover:text-black/90 " +
    "dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white/95 " +
    "transition-colors";

  return (
    <div className="flex shrink-0">
      <div className={STATUS_BAR}>
        <span className={STATUS_LABEL}>Markdown</span>
        <span className={STATUS_STAT}>{stats.bytes} bytes</span>
        <span className={STATUS_STAT}>{stats.words} words</span>
        <span className={STATUS_STAT}>{stats.lines} lines</span>
        <span className={STATUS_STAT}>Ln {cursor.line}, Col {cursor.col}</span>
        {/* <span className={STATUS_STAT}>
          {saveStatus === "Saving" ? "Saving…" : "Saved"}
        </span> */}
      </div>

      <div className={`${STATUS_BAR} border-l`}>
        <span className={STATUS_LABEL}>HTML</span>
        <span className={STATUS_STAT}>{htmlStats.chars} characters</span>
        <span className={STATUS_STAT}>{htmlStats.words} words</span>
        <span className={STATUS_STAT}>{htmlStats.paragraphs} paragraphs</span>

        {/* ml-auto pushes the export buttons to the far right of the HTML
            bar; shrink-0 keeps them visible if the bar gets crowded (the
            stats spans will get clipped by overflow-hidden first instead). */}
        <div className="ml-auto flex items-center gap-1 shrink-0 pl-2">
          <button
            className={STATUS_BUTTON}
            onClick={onExportHtml}
            title="Export as HTML"
            aria-label="Export as HTML"
          >
            <FileCode size={12} />
            Export HTML
          </button>
          <button
            className={STATUS_BUTTON}
            onClick={onExportPdf}
            title="Export as PDF"
            aria-label="Export as PDF"
          >
            <FileText size={12} />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}