"use client";

import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Opens a Tally feedback popup. The Tally embed script (loaded once in
// layout.tsx) scans the page for the data-tally-* attributes below and wires up
// the click itself — so there's no custom modal, no API route and no database;
// submissions are collected in your Tally dashboard.
//   data-tally-open       — the form id to open
//   data-tally-hide-title — hide the form title inside the popup
//   data-tally-auto-close — ms to wait before closing after submit
export default function FeedbackButton({
  triggerClassName = "",
}: {
  triggerClassName?: string;
}) {
  return (
    <Button
      variant="ghost"
      title="Send feedback"
      aria-label="Send feedback"
      data-tally-open="9qoNYK"
      data-tally-hide-title="1"
      data-tally-auto-close="1000"
      className={
        "flex h-7 w-auto cursor-pointer items-center gap-1.5 rounded-[6px] " +
        "border border-black/15 bg-black/[0.04] px-2.5 text-[12px] font-medium " +
        "text-black/75 transition-colors hover:-translate-y-px hover:bg-black/[0.08] " +
        "hover:text-black/90 active:translate-y-0 dark:border-white/20 " +
        "dark:bg-white/[0.08] dark:text-white/80 dark:hover:bg-white/[0.14] " +
        "dark:hover:text-white " +
        triggerClassName
      }
    >
      <MessageSquarePlus className="size-[15px]" />
      {/* Label hides on very small screens to save toolbar space. */}
      <span className="hidden sm:inline">Feedback</span>
    </Button>
  );
}
