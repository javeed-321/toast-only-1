"use client";

import { ReactNode } from "react";
import {
  Bold, Italic,Strikethrough,  Heading1,  Heading2,  Minus,  Quote,  List,  ListOrdered,  ListChecks,  Code,  Braces,  Link,  Image,  Table,  FileCode,  FileText,  Sun,  Moon,
  Eye,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Exec = (cmd: string, payload?: Record<string, any>) => void;

type ToolbarProps = {
  exec: Exec;
  darkMode: boolean;
  onToggleTheme: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  handleRightPane: () => void;
};
const ICON_SIZE = 15;
export default function Toolbar({
  exec,
  darkMode,
  onToggleTheme,
  onExportHtml,
  onExportPdf,
  handleRightPane,
}: ToolbarProps) {
  // The uniform formatting buttons. Add or remove one by editing this array.
  const buttons: { title: string; onClick: () => void; icon: ReactNode }[] = [
    { title: "Bold",            onClick: () => exec("bold"),                                                 icon: <Bold size={ICON_SIZE} /> },
    { title: "Italic",          onClick: () => exec("italic"),                                               icon: <Italic size={ICON_SIZE} /> },
    { title: "Strikethrough",   onClick: () => exec("strike"),                                               icon: <Strikethrough size={ICON_SIZE} /> },
    { title: "Heading 1",       onClick: () => exec("heading", { level: 1 }),                                icon: <Heading1 size={ICON_SIZE} /> },
    { title: "Heading 2",       onClick: () => exec("heading", { level: 2 }),                                icon: <Heading2 size={ICON_SIZE} /> },
    { title: "Horizontal rule", onClick: () => exec("hr"),                                                   icon: <Minus size={ICON_SIZE} /> },
    { title: "Blockquote",      onClick: () => exec("blockQuote"),                                           icon: <Quote size={ICON_SIZE} /> },
    { title: "Bulleted list",   onClick: () => exec("bulletList"),                                           icon: <List size={ICON_SIZE} /> },
    { title: "Numbered list",   onClick: () => exec("orderedList"),                                          icon: <ListOrdered size={ICON_SIZE} /> },
    { title: "Task list",       onClick: () => exec("taskList"),                                             icon: <ListChecks size={ICON_SIZE} /> },
    { title: "Inline code",     onClick: () => exec("code"),                                                 icon: <Code size={ICON_SIZE} /> },
    { title: "Code block",      onClick: () => exec("codeBlock"),                                            icon: <Braces size={ICON_SIZE} /> },
    { title: "Link",            onClick: () => exec("addLink", { linkUrl: "https://", linkText: "link" }),   icon: <Link size={ICON_SIZE} /> },
    { title: "Image",           onClick: () => exec("addImage", { imageUrl: "" }),                           icon: <Image size={ICON_SIZE} /> },
    { title: "Table",           onClick: () => exec("addTable", { rowCount: 3, columnCount: 3 }),            icon: <Table size={ICON_SIZE} /> },
  ];


  return (
    <div className="my-toolbar">
      {/* Formatting buttons — all uniform, so we render them with a single map. */}
      {buttons.map((b, i) => (
        <button key={i} title={b.title} aria-label={b.title} onClick={b.onClick}>
          {b.icon}
        </button>
      ))}

      {/* Pushes the buttons after it to the far right. */}
      <span className="my-toolbar__spacer" />

      <button title="Export as HTML" aria-label="Export as HTML" onClick={onExportHtml}>
        <FileCode size={16} />
      </button>

      <button title="Export as PDF" aria-label="Export as PDF" onClick={onExportPdf}>
        <FileText size={16} />
      </button>

      <button
        className="my-toolbar__theme"
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle dark mode"
        onClick={onToggleTheme}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button onClick={handleRightPane} aria-label="Toggle right pane">
        <Eye size={18} />
      </button>
    </div>
  );
}
