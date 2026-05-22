"use client";

import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Opens a Tally feedback popup. Previously the Tally embed script was loaded for
// every visitor in layout.tsx (just to bind this button's click). Instead we
// load it lazily on the first click, so its ~14 KB never touches the initial
// page load for the (most) visitors who never open feedback. Once loaded, Tally
// exposes `window.Tally.openPopup`, which we call directly with the same options
// the old data-tally-* attributes used.
const TALLY_SRC = "https://tally.so/widgets/embed.js";
const FORM_ID = "9qoNYK";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TallyGlobal = { openPopup: (formId: string, options?: Record<string, any>) => void };

declare global {
  interface Window {
    Tally?: TallyGlobal;
  }
}

// Load the embed script once; reused across clicks.
let tallyPromise: Promise<void> | null = null;
function loadTally(): Promise<void> {
  if (window.Tally) return Promise.resolve();
  if (tallyPromise) return tallyPromise;
  tallyPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TALLY_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Tally failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = TALLY_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      tallyPromise = null; // allow a retry on the next click
      reject(new Error("Tally failed to load"));
    };
    document.body.appendChild(script);
  });
  return tallyPromise;
}

export default function FeedbackButton({
  triggerClassName = "",
}: {
  triggerClassName?: string;
}) {
  
  const openFeedback = async () => {
    try {
      await loadTally();
      window.Tally?.openPopup(FORM_ID, { hideTitle: true, autoClose: 1000 });
    } catch {
      // Network/load failure — fall back to opening the form in a new tab so
      // the button is never a dead end.
      window.open(`https://tally.so/r/${FORM_ID}`, "_blank", "noopener");
    }
  };

  return (
    <Button
      variant="ghost"
      title="Send feedback"
      aria-label="Send feedback"
      aria-haspopup="dialog"
      onClick={openFeedback}
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
