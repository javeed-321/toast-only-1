import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toolbar from "./Toolbar";

function makeProps(overrides: Partial<React.ComponentProps<typeof Toolbar>> = {}) {
  return {
    exec: vi.fn(),
    darkMode: false,
    onToggleTheme: vi.fn(),
    onExportHtml: vi.fn(),
    handleRightPane: vi.fn(),
    mobileView: "edit" as const,
    onMobileView: vi.fn(),
    ...overrides,
  } satisfies React.ComponentProps<typeof Toolbar>;
}

describe("Toolbar", () => {
  it("renders the primary formatting buttons", () => {
    render(<Toolbar {...makeProps()} />);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Heading 1" })).toBeInTheDocument();
  });

  it("calls exec('bold') with no payload when Bold is clicked", async () => {
    const exec = vi.fn();
    render(<Toolbar {...makeProps({ exec })} />);

    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(exec).toHaveBeenCalledWith("bold");
  });

  it("passes the level payload for headings", async () => {
    const exec = vi.fn();
    render(<Toolbar {...makeProps({ exec })} />);

    await userEvent.click(screen.getByRole("button", { name: "Heading 1" }));
    expect(exec).toHaveBeenCalledWith("heading", { level: 1 });
  });

  it("passes default link arguments", async () => {
    const exec = vi.fn();
    render(<Toolbar {...makeProps({ exec })} />);

    await userEvent.click(screen.getByRole("button", { name: "Link" }));
    expect(exec).toHaveBeenCalledWith("addLink", {
      linkUrl: "https://",
      linkText: "link",
    });
  });

  it("passes default table dimensions", async () => {
    const exec = vi.fn();
    render(<Toolbar {...makeProps({ exec })} />);

    await userEvent.click(screen.getByRole("button", { name: "Table" }));
    expect(exec).toHaveBeenCalledWith("addTable", {
      rowCount: 3,
      columnCount: 3,
    });
  });

  it("invokes onToggleTheme from the theme button", async () => {
    const onToggleTheme = vi.fn();
    render(<Toolbar {...makeProps({ onToggleTheme })} />);

    await userEvent.click(screen.getByRole("button", { name: "Toggle dark mode" }));
    expect(onToggleTheme).toHaveBeenCalledOnce();
  });

  it("labels the theme button by the target mode", () => {
    const { rerender } = render(<Toolbar {...makeProps({ darkMode: false })} />);
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" })
    ).toHaveAttribute("title", "Switch to dark mode");

    rerender(<Toolbar {...makeProps({ darkMode: true })} />);
    expect(
      screen.getByRole("button", { name: "Toggle dark mode" })
    ).toHaveAttribute("title", "Switch to light mode");
  });

  it("toggles the right pane from the desktop split button", async () => {
    const handleRightPane = vi.fn();
    render(<Toolbar {...makeProps({ handleRightPane })} />);

    await userEvent.click(screen.getByRole("button", { name: "Toggle right pane" }));
    expect(handleRightPane).toHaveBeenCalledOnce();
  });

  it("switches mobile view when an edit/preview toggle is chosen", async () => {
    const onMobileView = vi.fn();
    render(<Toolbar {...makeProps({ mobileView: "edit", onMobileView })} />);

    await userEvent.click(screen.getByRole("button", { name: "Show preview" }));
    expect(onMobileView).toHaveBeenCalledWith("preview");
  });

  it("opens the overflow sheet exposing the non-primary tools", async () => {
    render(<Toolbar {...makeProps()} />);

    // The overflow sheet is the three-dots menu that holds the non-primary
    // tools below lg. Opening it mounts a modal dialog containing those tools.
    await userEvent.click(screen.getByRole("button", { name: "More tools" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Strikethrough" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Code block" })).toBeInTheDocument();
  });

  it("runs the tool's command when a sheet item is clicked", async () => {
    const exec = vi.fn();
    render(<Toolbar {...makeProps({ exec })} />);

    await userEvent.click(screen.getByRole("button", { name: "More tools" }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Strikethrough" }));

    expect(exec).toHaveBeenCalledWith("strike");
  });
});
