"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// `beforeinstallprompt` isn't in the TS DOM lib yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// localStorage keys:
//  - DISMISSED_KEY: toggled true when the user closes the toast. On the next
//    refresh we toggle it back to false so the prompt shows again (i.e. it
//    reappears on every refresh until the app is actually installed).
//  - INSTALLED_KEY: set once the app is installed, after which we never prompt.
const DISMISSED_KEY = "pwa-install-dismissed";
const INSTALLED_KEY = "pwa-installed";

// Auto-close if the user ignores it.
const AUTO_CLOSE_MS = 12000;
// Small delay before showing so it slides in after the page settles.
const SHOW_DELAY_MS = 700;

const ls = {
  get(key: string) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

/**
 * Bottom-right "Add to home screen?" toast.
 *
 * Shows on every refresh (toggling a localStorage flag) until the app is
 * installed. YES triggers the native install dialog when the browser offers it;
 * NO (or no choice within AUTO_CLOSE_MS) just closes — and it returns next
 * refresh.
 */
export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed (flag set previously, or running as a standalone PWA)?
    // Then never prompt.
    const installed =
      ls.get(INSTALLED_KEY) === "true" ||
      window.matchMedia("(display-mode: standalone)").matches;
    if (installed) return;

    // Reappear on every refresh: if it was dismissed last time, toggle the flag
    // back off so the prompt shows again now.
    if (ls.get(DISMISSED_KEY) === "true") ls.set(DISMISSED_KEY, "false");

    // Capture the install event if/when the browser offers it (powers YES).
    const onPrompt = (e: Event) => {
      e.preventDefault(); // suppress the browser's default mini-infobar
      deferredRef.current = e as BeforeInstallPromptEvent;
    };
    const onInstalled = () => {
      ls.set(INSTALLED_KEY, "true");
      setVisible(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Show on every refresh.
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(t);
    };
  }, []);

  // Auto-dismiss if the user doesn't choose.
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    ls.set(DISMISSED_KEY, "true"); // toggled back on next refresh
  }, []);

  const install = useCallback(async () => {
    const ev = deferredRef.current;
    setVisible(false);
    if (!ev) return; // browser didn't offer an install (e.g. not installable)
    await ev.prompt(); // native install dialog
    const choice = await ev.userChoice.catch(() => null);
    if (choice?.outcome === "accepted") ls.set(INSTALLED_KEY, "true");
    deferredRef.current = null;
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install Markdown Editor"
      className="fixed bottom-4 right-4 z-[1000] flex max-w-[20rem] items-center gap-3 rounded-xl bg-neutral-900 px-4 py-3 text-white shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </span>

      <p className="flex-1 text-sm leading-snug">
        Add <span className="font-semibold">Markdown Editor</span> to your home
        screen?
      </p>

      <button
        type="button"
        onClick={dismiss}
        className="rounded-md px-2.5 py-1 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        NO
      </button>
      <button
        type="button"
        onClick={install}
        className="rounded-md bg-white/15 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-white/25"
      >
        YES
      </button>
    </div>
  );
}
