"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// Floating button that jumps the markdown editor to the bottom when you're in
// the top half of the document, and back to the top when you're in the bottom
// half. The arrow flips to show where it will take you.
//
// `ready` should flip true once the editor has mounted (its onLoad), so the
// scrollable .ProseMirror surface exists in the DOM by the time we look for it.
export default function ScrollToggle({ ready }: { ready: boolean }) {
  const scrollerRef = useRef<HTMLElement | null>(null);
  const [nearTop, setNearTop] = useState(true);

  useEffect(() => {
    if (!ready) return;
    // The markdown editor's scrollable element (overflow-y: auto in toast CSS).
    const el = document.querySelector<HTMLElement>(
      ".toastui-editor-md-container .ProseMirror"
    );
    if (!el) return;
    scrollerRef.current = el;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      // In the top half → next action is "go down"; bottom half → "go up".
      setNearTop(max <= 0 ? true : el.scrollTop < max / 2);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ready]);

  const handleClick = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: nearTop ? el.scrollHeight : 0, behavior: "auto" });
  };

  if (!ready) return null;

  return (
    // shadcn Button (variant outline); classes merged last so they override the
    // outline defaults and keep the original floating-pill look. The icon carries
    // an explicit size so Button's cva doesn't force it to 16px.
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={nearTop ? "Scroll to bottom" : "Scroll to top"}
      title={nearTop ? "Scroll to bottom" : "Scroll to top"}
      className={
        "absolute bottom-4 right-4 z-20 h-9 w-9 rounded-full shadow-sm " +
        "bg-[#f3f3f3] border-[#dcdcdc] text-black/70 hover:bg-black/5 hover:text-black/90 " +
        "dark:bg-[#1e1e1e] dark:border-[#3a3a3a] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white/95"
      }
    >
      {nearTop ? <ArrowDown className="size-[18px]" /> : <ArrowUp className="size-[18px]" />}
    </Button>
  );
}
