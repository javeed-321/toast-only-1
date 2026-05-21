"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquarePlus, Star, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "sent" | "error";

// Self-contained feedback widget: renders its own trigger button plus the modal,
// star rating, honeypot, and submit logic. Drop <FeedbackButton /> anywhere —
// it threads no state through its parent. Posts to /api/feedback, which stores
// the entry in Supabase. No login required from the visitor.
export default function FeedbackButton({
  triggerClassName = "",
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot — stays empty for humans
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset the form whenever the modal opens, and focus the textarea.
  useEffect(() => {
    if (!open) return;
    setMessage("");
    setRating(0);
    setEmail("");
    setCompany("");
    setStatus("idle");
    setError("");
    const t = setTimeout(() => textareaRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // Escape closes the modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit() {
    if (!message.trim() || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          rating: rating || undefined,
          email: email.trim() || undefined,
          company, // honeypot
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      // Briefly show the thank-you, then close.
      setTimeout(() => setOpen(false), 1400);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        title="Send feedback"
        aria-label="Send feedback"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        <MessageSquarePlus className="size-[18px]" />
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close feedback"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
          />

          {/* Card */}
          <div className="relative w-full max-w-md rounded-2xl border border-[#dcdcdc] bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-[#3a3a3a] dark:bg-[#1e1e1e]">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-black/85 dark:text-white/90">
                  Send feedback
                </h2>
                <p className="mt-0.5 text-[12px] text-black/55 dark:text-white/50">
                  No account needed — tell us what you think.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-black/50 transition-colors hover:bg-black/[0.06] hover:text-black/80 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/85"
              >
                <X className="size-4" />
              </button>
            </div>

            {status === "sent" ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
                  <Check className="size-6" />
                </span>
                <p className="text-sm font-medium text-black/80 dark:text-white/85">
                  Thanks for your feedback!
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="flex flex-col gap-3"
              >
                {/* Star rating (optional) */}
                <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      aria-pressed={rating >= n}
                      onClick={() => setRating(rating === n ? 0 : n)}
                      className="rounded p-0.5 text-black/30 transition-colors hover:text-amber-400 dark:text-white/25"
                    >
                      <Star
                        className={`size-5 ${
                          rating >= n ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="What's working well? What could be better?"
                  className="w-full resize-y rounded-lg border border-[#dcdcdc] bg-white px-3 py-2 text-sm text-black/85 outline-none transition-colors placeholder:text-black/35 focus:border-black/40 dark:border-[#3a3a3a] dark:bg-[#252526] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-white/40"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional, if you'd like a reply)"
                  className="w-full rounded-lg border border-[#dcdcdc] bg-white px-3 py-2 text-sm text-black/85 outline-none transition-colors placeholder:text-black/35 focus:border-black/40 dark:border-[#3a3a3a] dark:bg-[#252526] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-white/40"
                />

                {/* Honeypot: hidden from humans, tempting to bots. Off-screen + aria-hidden. */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                {error && (
                  <p className="text-[12px] text-red-500" role="alert">
                    {error}
                  </p>
                )}

                <div className="mt-1 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="text-black/65 dark:text-white/65"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!message.trim() || status === "sending"}
                    className="gap-1.5"
                  >
                    {status === "sending" && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {status === "sending" ? "Sending…" : "Send"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
