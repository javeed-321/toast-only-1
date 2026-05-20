"use client";

import { useEffect, useState } from "react";
import { loadCurrentDoc, saveCurrentDoc } from "../lib/db";

const AUTOSAVE_DEBOUNCE_MS = 100;

export type SaveStatus = "saved" | "saving";

/**
 * Loads the saved document from IndexedDB on mount and autosaves it
 * (debounced) on every change. Falls back to `fallback` if there is
 * nothing stored yet.
 *
 * Returns: { text, setText, hydrated, saveStatus }
 *   - text:       current Markdown string
 *   - setText:    update the document
 *   - hydrated:   true once the initial load has completed
 *   - saveStatus: "saving" while a write is pending, "saved" otherwise
 */
export function useMarkdownDoc(fallback: string) {
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  // Load on first mount.
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await loadCurrentDoc();
        setText(stored ?? fallback);
      } catch (err) {
        console.error("Failed to load doc:", err);
        setText(fallback);
      } finally {
        setHydrated(true);
      }
    };

    load();
  }, [fallback]);

  // Debounced autosave — runs whenever the text changes (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    setSaveStatus("saving");

    const id = setTimeout(async () => {
      try {
        await saveCurrentDoc(text);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSaveStatus("saved");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [text, hydrated]);

  return { text, setText, hydrated, saveStatus };
}
