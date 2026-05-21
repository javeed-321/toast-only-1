"use client";

import { ReactNode, useState } from "react";
import {
  Bold, Italic,Strikethrough,  Heading1,  Heading2,  Minus,  Quote,  List,  ListOrdered,  ListChecks,  Code,  Braces,  Link,  Image,  Table,  Sun,  Moon,
  Eye,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FeedbackButton from "./FeedbackButton";

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

// Bar surface: shares the preview pane's palette (#f3f3f3 / #1e1e1e dark), 40px,
// sticky. Buttons below are shadcn <Button variant="ghost">; these classes are
// merged last (tailwind-merge) so they override the ghost variant's defaults and
// keep the original look. Arbitrary radii because this project remaps the
// Tailwind radius scale in globals.css (rounded-md = 8px here).
const BAR =
  "sticky z-[100] box-border flex h-10 flex-wrap items-center gap-1 border-b " +
  "border-[#dcdcdc] bg-[#f3f3f3] px-2.5 py-1.5 transition-colors duration-200 " +
  "dark:border-[#3a3a3a] dark:bg-[#1e1e1e]";

// Look overrides applied to each ghost Button: size 30×28, 6px radius, no
// padding, the toolbar's faint hover wash + lift. Display & idle color are added
// per-button (the theme toggle uses a slightly darker idle color).
const TOOLBAR_BTN =
  "h-7 w-[30px] cursor-pointer rounded-[6px] p-0 " +
  "transition-[background-color,color,transform] duration-150 " +
  "hover:-translate-y-px hover:bg-black/[0.06] hover:text-black/90 active:translate-y-0 " +
  "dark:hover:bg-white/[0.12] dark:hover:text-white";
const TOOLBAR_IDLE = "text-black/70 dark:text-white/70";

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
  // Backdrop, focus trap and Escape-to-close are handled by the shadcn Sheet.
  const [moreOpen, setMoreOpen] = useState(false);

  // Single ordered list — same order as before, so the desktop bar is unchanged.
  // `primary` marks the few that also stay visible on tablet/mobile; the rest
  // collapse into the three-dots sheet there (and stay inline on lg+).
  // Icons carry an explicit `size-[14px]` class so shadcn's Button cva (which
  // forces unclassed svgs to size-4 / 16px) leaves their size alone.
const ICON_SIZE = "size-[15px]";

const buttons: ToolButton[] = [
    { title: "Bold",            onClick: () => exec("bold"),                                                 icon: <Bold className={ICON_SIZE} />,          primary: true },
    { title: "Italic",          onClick: () => exec("italic"),                                               icon: <Italic className={ICON_SIZE} />,        primary: true },
    { title: "Strikethrough",   onClick: () => exec("strike"),                                               icon: <Strikethrough className={ICON_SIZE} /> },
    { title: "Heading 1",       onClick: () => exec("heading", { level: 1 }),                                icon: <Heading1 className={ICON_SIZE} />,      primary: true },
    { title: "Heading 2",       onClick: () => exec("heading", { level: 2 }),                                icon: <Heading2 className={ICON_SIZE} /> },
    { title: "Horizontal rule", onClick: () => exec("hr"),                                                   icon: <Minus className={ICON_SIZE} /> },
    { title: "Blockquote",      onClick: () => exec("blockQuote"),                                           icon: <Quote className={ICON_SIZE} /> },
    { title: "Bulleted list",   onClick: () => exec("bulletList"),                                           icon: <List className={ICON_SIZE} />,          primary: true },
    { title: "Numbered list",   onClick: () => exec("orderedList"),                                          icon: <ListOrdered className={ICON_SIZE} /> },
    { title: "Task list",       onClick: () => exec("taskList"),                                             icon: <ListChecks className={ICON_SIZE} /> },
    { title: "Inline code",     onClick: () => exec("code"),                                                 icon: <Code className={ICON_SIZE} />,          primary: true },
    { title: "Code block",      onClick: () => exec("codeBlock"),                                            icon: <Braces className={ICON_SIZE} /> },
    { title: "Link",            onClick: () => exec("addLink", { linkUrl: "https://", linkText: "link" }),   icon: <Link className={ICON_SIZE} /> },
    { title: "Image",           onClick: () => exec("addImage", { imageUrl: "" }),                           icon: <Image className={ICON_SIZE} /> },
    { title: "Table",           onClick: () => exec("addTable", { rowCount: 3, columnCount: 3 }),            icon: <Table className={ICON_SIZE} /> },
  ];

  // The non-primary buttons, in order — these populate the three-dots sheet.
  const more = buttons.filter((b) => !b.primary);

  return (
    <>
    <div className={BAR}>
      {/* Formatting buttons — same order as before. Primary ones are always
          inline; the rest are inline only from lg up (below lg they live in the
          three-dots sheet). */}
      {buttons.map((b, i) => (
        <Button
          key={i}
          variant="ghost"
          title={b.title}
          aria-label={b.title}
          onClick={b.onClick}
          className={`${b.primary ? "" : "hidden lg:inline-flex"} ${TOOLBAR_BTN} ${TOOLBAR_IDLE}`}
        >
          {b.icon}
        </Button>
      ))}

      {/* Three-dots overflow — opens the sheet. Hidden once everything fits (lg+). */}
      <Button
        variant="ghost"
        className={`lg:hidden ${TOOLBAR_BTN} ${TOOLBAR_IDLE}`}
        title="More tools"
        aria-label="More tools"
        aria-haspopup="dialog"
        aria-expanded={moreOpen}
        onClick={() => setMoreOpen(true)}
      >
        <MoreHorizontal className="size-[14px]" />
      </Button>

      {/* Pushes everything after it to the far right. */}
      <span className="flex-1" />

      {/* Compact edit/preview switch — one pane at a time on tablet & mobile.
          shadcn ToggleGroup (single-select); the pressed item gets the surface
          color so it reads as a pressed tab. */}
      <ToggleGroup
        value={[mobileView]}
        onValueChange={(vals) => {
          const next = vals[0] as MobileView | undefined;
          if (next) onMobileView(next);
        }}
        className="gap-0.5 rounded-[8px] bg-black/5 p-0.5 lg:hidden dark:bg-white/[0.08]"
      >
        <ToggleGroupItem
          value="edit"
          title="Show editor"
          aria-label="Show editor"
          className="h-7 w-[30px] min-w-0 cursor-pointer rounded-[6px] p-0 text-black/70 hover:bg-black/[0.06] hover:text-black/90 data-[pressed]:bg-white data-[pressed]:text-black/90 dark:text-white/70 dark:hover:bg-white/[0.12] dark:hover:text-white dark:data-[pressed]:bg-[#3a3a3a] dark:data-[pressed]:text-white"
        >
          <Pencil className="size-[14px]" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="preview"
          title="Show preview"
          aria-label="Show preview"
          className="h-7 w-[30px] min-w-0 cursor-pointer rounded-[6px] p-0 text-black/70 hover:bg-black/[0.06] hover:text-black/90 data-[pressed]:bg-white data-[pressed]:text-black/90 dark:text-white/70 dark:hover:bg-white/[0.12] dark:hover:text-white dark:data-[pressed]:bg-[#3a3a3a] dark:data-[pressed]:text-white"
        >
          <Eye className="size-[14px]" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Feedback — self-contained trigger + modal; posts to /api/feedback. */}
      <FeedbackButton triggerClassName={`${TOOLBAR_BTN} text-black/80 dark:text-white/85`} />

      <Button
        variant="ghost"
        className={`${TOOLBAR_BTN} text-black/80 dark:text-white/85`}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle dark mode"
        onClick={onToggleTheme}
      >
        {darkMode ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      </Button>

      {/* Desktop split toggle — only meaningful when both panes share the screen. */}
      <Button
        variant="ghost"
        onClick={handleRightPane}
        aria-label="Toggle right pane"
        title="Toggle right pane"
        className={`hidden lg:inline-flex ${TOOLBAR_BTN} ${TOOLBAR_IDLE}`}
      >
        <Eye className="size-[18px]" />
      </Button>
    </div>

      {/* ── Overflow sheet (tablet / mobile only) ──
          shadcn Sheet (a Base UI dialog) as a bottom sheet. It owns the
          backdrop, focus trap and Escape handling. lg:hidden on the content
          keeps it off the desktop, where the three-dots trigger isn't shown. */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-[#dcdcdc] bg-[#f3f3f3] pb-6 lg:hidden dark:border-[#3a3a3a] dark:bg-[#1e1e1e]"
        >
          <SheetHeader className="pb-0">
            <SheetTitle className="text-[13px] font-semibold text-black/80 dark:text-white/85">
              More tools
            </SheetTitle>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-1.5 px-4 pb-2">
            {more.map((b, i) => (
              <Button
                key={i}
                variant="ghost"
                onClick={() => {
                  b.onClick();
                  setMoreOpen(false);
                }}
                title={b.title}
                aria-label={b.title}
                className="h-auto justify-start gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-black/75 hover:bg-black/5 hover:text-black/90 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white/95"
              >
                {b.icon}
                <span className="truncate">{b.title}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
