"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Bold, Italic,Strikethrough,  Heading1,  Heading2,  Minus,  Quote,  List,  ListOrdered,  ListChecks,  Code,  Braces,  Link,  Image,  Table,  Sun,  Moon,
  Eye,
  Pencil,
  MoreHorizontal,
  X,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Exec = (cmd: string, payload?: Record<string, any>) => void;

type MobileView = "edit" | "preview";

type ToolbarProps = {
  exec: Exec;
  darkMode: boolean;
  onToggleTheme: () => void;
  onExportHtml: () => void;
  handleRightPane: () => void;
  // Compact (tablet / mobile) single-pane state — which editor is on screen.
  mobileView: MobileView;
  onMobileView: (view: MobileView) => void;
};
const ICON_SIZE = 14;

type ToolButton = {
  title: string;
  onClick: () => void;
  icon: ReactNode;
  // primary buttons stay on the bar at every width; the rest show inline only
  // on lg+ and move into the three-dots sheet below that.
  primary?: boolean;
};

export default function Toolbar({
  exec,
  darkMode,
  onToggleTheme,
  handleRightPane,
  mobileView,
  onMobileView,
}: ToolbarProps) {
  // Whether the "more" sheet (the three-dots overflow menu) is open. Only ever
  // visible below `lg` — on desktop every button sits inline so it's never used.
  const [moreOpen, setMoreOpen] = useState(false);

  // Close the sheet on Escape for keyboard users.
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  // Single ordered list — same order as before, so the desktop bar is unchanged.
  // `primary` marks the few that also stay visible on tablet/mobile; the rest
  // collapse into the three-dots sheet there (and stay inline on lg+).
  const buttons: ToolButton[] = [
    { title: "Bold",            onClick: () => exec("bold"),                                                 icon: <Bold size={ICON_SIZE} />,          primary: true },
    { title: "Italic",          onClick: () => exec("italic"),                                               icon: <Italic size={ICON_SIZE} />,        primary: true },
    { title: "Strikethrough",   onClick: () => exec("strike"),                                               icon: <Strikethrough size={ICON_SIZE} /> },
    { title: "Heading 1",       onClick: () => exec("heading", { level: 1 }),                                icon: <Heading1 size={ICON_SIZE} />,      primary: true },
    { title: "Heading 2",       onClick: () => exec("heading", { level: 2 }),                                icon: <Heading2 size={ICON_SIZE} /> },
    { title: "Horizontal rule", onClick: () => exec("hr"),                                                   icon: <Minus size={ICON_SIZE} /> },
    { title: "Blockquote",      onClick: () => exec("blockQuote"),                                           icon: <Quote size={ICON_SIZE} /> },
    { title: "Bulleted list",   onClick: () => exec("bulletList"),                                           icon: <List size={ICON_SIZE} />,          primary: true },
    { title: "Numbered list",   onClick: () => exec("orderedList"),                                          icon: <ListOrdered size={ICON_SIZE} /> },
    { title: "Task list",       onClick: () => exec("taskList"),                                             icon: <ListChecks size={ICON_SIZE} /> },
    { title: "Inline code",     onClick: () => exec("code"),                                                 icon: <Code size={ICON_SIZE} />,          primary: true },
    { title: "Code block",      onClick: () => exec("codeBlock"),                                            icon: <Braces size={ICON_SIZE} /> },
    { title: "Link",            onClick: () => exec("addLink", { linkUrl: "https://", linkText: "link" }),   icon: <Link size={ICON_SIZE} /> },
    { title: "Image",           onClick: () => exec("addImage", { imageUrl: "" }),                           icon: <Image size={ICON_SIZE} /> },
    { title: "Table",           onClick: () => exec("addTable", { rowCount: 3, columnCount: 3 }),            icon: <Table size={ICON_SIZE} /> },
  ];

  // The non-primary buttons, in order — these populate the three-dots sheet.
  const more = buttons.filter((b) => !b.primary);

  return (
    <>
    <div className="my-toolbar">
      {/* Formatting buttons — same order/markup as before on desktop. Non-primary
          ones carry `tb-lg-only`, which the CSS hides below lg (they live in the
          sheet there). Visibility is done in CSS, not Tailwind utilities, because
          the `.my-toolbar button` rule out-specifies a utility like `hidden`. */}
      {buttons.map((b, i) => (
        <button
          key={i}
          title={b.title}
          aria-label={b.title}
          onClick={b.onClick}
          className={b.primary ? undefined : "tb-lg-only"}
        >
          {b.icon}
        </button>
      ))}

      {/* Three-dots overflow — opens the sheet. Hidden once everything fits (lg+). */}
      <button
        className="tb-mobile-only"
        title="More tools"
        aria-label="More tools"
        aria-haspopup="dialog"
        aria-expanded={moreOpen}
        onClick={() => setMoreOpen(true)}
      >
        <MoreHorizontal size={ICON_SIZE} />
      </button>

      {/* Pushes everything after it to the far right. */}
      <span className="my-toolbar__spacer" />

      {/* Compact edit/preview switch — one pane at a time on tablet & mobile. */}
      <div className="my-toolbar__segment tb-mobile-only">
        <button
          title="Show editor"
          aria-label="Show editor"
          aria-pressed={mobileView === "edit"}
          data-active={mobileView === "edit"}
          onClick={() => onMobileView("edit")}
        >
          <Pencil size={ICON_SIZE} />
        </button>
        <button
          title="Show preview"
          aria-label="Show preview"
          aria-pressed={mobileView === "preview"}
          data-active={mobileView === "preview"}
          onClick={() => onMobileView("preview")}
        >
          <Eye size={ICON_SIZE} />
        </button>
      </div>

      <button
        className="my-toolbar__theme"
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle dark mode"
        onClick={onToggleTheme}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Desktop split toggle — only meaningful when both panes share the screen. */}
      <button
        onClick={handleRightPane}
        aria-label="Toggle right pane"
        title="Toggle right pane"
        className="tb-lg-only"
      >
        <Eye size={18} />
      </button>
    </div>

      {/* ── Overflow sheet (tablet / mobile only). Rendered OUTSIDE .my-toolbar so
          the `.my-toolbar button` sizing rule doesn't shrink its labeled rows. */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-[200] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="More tools"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMoreOpen(false)}
          />
          {/* Bottom sheet — same 3-color palette as the rest of the chrome. */}
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t bg-[#f3f3f3] border-[#dcdcdc] p-4 pb-6 shadow-xl dark:bg-[#1e1e1e] dark:border-[#3a3a3a] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80 sm:rounded-2xl sm:border"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-black/80 dark:text-white/85">
                More tools
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close"
                title="Close"
                className="flex h-7 w-7 items-center justify-center rounded-md text-black/60 hover:bg-black/5 hover:text-black/90 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/95"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {more.map((b, i) => (
                <button
                  key={i}
                  onClick={() => {
                    b.onClick();
                    setMoreOpen(false);
                  }}
                  title={b.title}
                  aria-label={b.title}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-black/75 hover:bg-black/5 hover:text-black/90 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white/95"
                >
                  {b.icon}
                  <span className="truncate">{b.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
