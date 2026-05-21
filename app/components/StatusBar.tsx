"use client";

import { FileCode, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPdf } from "../lib/utils";

type StatusBarProps = {
  stats: { bytes: number; words: number; lines: number };
  htmlStats: { chars: number; words: number; paragraphs: number };
  cursor: { line: number; col: number };
  saveStatus?: "Saved" | "Saving";
  onExportHtml: () => void;
  onExportPdf: () => void;
};

export default function StatusBar({
  stats,
  htmlStats,
  cursor,
  saveStatus = "Saving",
  onExportHtml,
      onExportPdf

}: StatusBarProps) {
  // One bar per pane. On small screens they stack full-width (flex-col on the
  // wrapper) and are allowed to scroll sideways instead of clipping stats; from
  // `sm` up they split the width 50/50 and clip via overflow-hidden as before.
const STATUS_BAR =
    "flex w-full sm:basis-1/2 sm:grow sm:shrink min-w-0 items-center h-10 px-3 box-border " +
    "overflow-x-auto sm:overflow-hidden whitespace-nowrap no-scrollbar " +
    "select-none text-[11.5px] font-normal border-t bg-[#f3f3f3] border-gray-100 text-black/70 " +
    "dark:bg-[#1e1e1e] dark:border-transparent dark:text-white/70";
  const STATUS_LABEL =
    "shrink-0 text-black/80 font-semibold text-[11px] mr-1 dark:text-white/85";
  const STATUS_STAT =
    "shrink-0 before:content-['|'] before:mx-2 before:font-light before:text-[#dcdcdc] dark:before:text-[#3a3a3a]";

  // Compact text-button (shadcn ghost Button) — lives inside the h-7 bar without
  // breaking rhythm. These classes are merged last so they override the ghost
  // variant's defaults, keeping the original look: 20px tall, 4px radius, the
  // status bar's faint hover wash. No new hues.
  const STATUS_BUTTON =
    "h-5 gap-1 rounded-[4px] px-2 text-[11px] font-medium " +
    "text-black/75 hover:bg-black/5 hover:text-black/90 " +
    "dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white/95";

  return (
    <div className="flex flex-col sm:flex-row shrink-0">
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

      <div className={`${STATUS_BAR} sm:border-l`}>
        <span className={STATUS_LABEL}>HTML</span>
        <span className={STATUS_STAT}>{htmlStats.chars} characters</span>
        <span className={STATUS_STAT}>{htmlStats.words} words</span>
        <span className={STATUS_STAT}>{htmlStats.paragraphs} paragraphs</span>

        {/* ml-auto pushes the export buttons to the far right of the HTML
            bar; shrink-0 keeps them visible if the bar gets crowded (the
            stats spans will get clipped by overflow-hidden first instead). */}
        <div className="ml-auto flex items-center gap-1 shrink-0 pl-2">
          <Button
            variant="ghost"
            className={STATUS_BUTTON}
            onClick={onExportHtml}
            title="Export as HTML"
            aria-label="Export as HTML"
          >
            <FileCode className="size-[12px]" />
            <span className="hidden min-[420px]:inline">Export HTML</span>
          </Button>
          <Button
            variant="ghost"
            className={STATUS_BUTTON}
            onClick={onExportPdf}
            title="Export as PDF"
            aria-label="Export as PDF"
          >
            <FileText className="size-[12px]" />
            <span className="hidden min-[420px]:inline">Export PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}