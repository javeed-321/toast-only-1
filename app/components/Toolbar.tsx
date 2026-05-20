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
    { title: "Bold",            onClick: () => exec("bold"),                                       icon: <Bold size={18} /> },
    { title: "Italic",          onClick: () => exec("italic"),                                     icon: <Italic size={18} /> },
    { title: "Strikethrough",   onClick: () => exec("strike"),                                     icon: <Strikethrough size={18} /> },
    { title: "Heading 1",       onClick: () => exec("heading", { level: 1 }),                      icon: <Heading1 size={18} /> },
    { title: "Heading 2",       onClick: () => exec("heading", { level: 2 }),                      icon: <Heading2 size={18} /> },
    { title: "Horizontal rule", onClick: () => exec("hr"),                                         icon: <Minus size={18} /> },
    { title: "Blockquote",      onClick: () => exec("blockQuote"),                                 icon: <Quote size={18} /> },
    { title: "Bulleted list",   onClick: () => exec("bulletList"),                                 icon: <List size={18} /> },
    { title: "Numbered list",   onClick: () => exec("orderedList"),                                icon: <ListOrdered size={18} /> },
    { title: "Task list",       onClick: () => exec("taskList"),                                   icon: <ListChecks size={18} /> },
    { title: "Inline code",     onClick: () => exec("code"),                                       icon: <Code size={18} /> },
    { title: "Code block",      onClick: () => exec("codeBlock"),                                  icon: <Braces size={18} /> },
    { title: "Link",            onClick: () => exec("addLink", { linkUrl: "https://", linkText: "link" }), icon: <Link size={18} /> },
    { title: "Image",           onClick: () => exec("addImage", { imageUrl: "" }),                 icon: <Image size={18} /> },
    { title: "Table",           onClick: () => exec("addTable", { rowCount: 3, columnCount: 3 }),  icon: <Table size={18} /> },
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
