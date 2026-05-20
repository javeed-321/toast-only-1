"use client";

import { useEffect, useState, type RefObject } from "react";

// Tracks the caret's line/column in the Toast UI markdown editor for display in
// the status bar. In markdown mode `getSelection()` returns
//   [[startLine, startCol], [endLine, endCol]]
// with both values 1-based. We show the selection start (the caret position).
// `caretChange` fires on every transaction — typing, clicks, and arrow keys.
export function useCursorPosition(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tuiRef: RefObject<any>,
  ready: boolean
) {
  const [pos, setPos] = useState({ line: 1, col: 1 });

  useEffect(() => {
    if (!ready) return;
    const inst = tuiRef.current?.getInstance();
    if (!inst) return;

    const update = () => {
      const sel = inst.getSelection?.();
      const start = Array.isArray(sel?.[0]) ? sel[0] : null;
      if (start) setPos({ line: start[0], col: start[1] });
    };

    inst.on("caretChange", update);
    update(); // set the initial position

    return () => inst.off?.("caretChange");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return pos;
}
