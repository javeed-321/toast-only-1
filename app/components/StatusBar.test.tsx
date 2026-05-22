import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatusBar from "./StatusBar";

// exportPdf is a DOM/iframe/print side effect; StatusBar only needs its export
// callbacks to fire, so we stub the module to keep these tests pure.
vi.mock("../lib/utils", () => ({ exportPdf: vi.fn() }));

function makeProps(overrides: Partial<React.ComponentProps<typeof StatusBar>> = {}) {
  return {
    stats: { bytes: 532, words: 98, lines: 12 },
    htmlStats: { chars: 412, words: 80, paragraphs: 5 },
    cursor: { line: 12, col: 4 },
    onExportHtml: vi.fn(),
    onExportPdf: vi.fn(),
    ...overrides,
  } satisfies React.ComponentProps<typeof StatusBar>;
}

describe("StatusBar", () => {
  it("renders the markdown-pane stats", () => {
    render(<StatusBar {...makeProps()} />);
    expect(screen.getByText("532 bytes")).toBeInTheDocument();
    expect(screen.getByText("98 words")).toBeInTheDocument();
    expect(screen.getByText("12 lines")).toBeInTheDocument();
  });

  it("renders the cursor position", () => {
    render(<StatusBar {...makeProps({ cursor: { line: 7, col: 3 } })} />);
    expect(screen.getByText("Ln 7, Col 3")).toBeInTheDocument();
  });

  it("renders the html-pane stats", () => {
    render(<StatusBar {...makeProps()} />);
    expect(screen.getByText("412 characters")).toBeInTheDocument();
    expect(screen.getByText("5 paragraphs")).toBeInTheDocument();
  });

  it("calls onExportHtml when the HTML button is clicked", async () => {
    const onExportHtml = vi.fn();
    render(<StatusBar {...makeProps({ onExportHtml })} />);

    await userEvent.click(screen.getByRole("button", { name: "Export as HTML" }));
    expect(onExportHtml).toHaveBeenCalledOnce();
  });

  it("calls onExportPdf when the PDF button is clicked", async () => {
    const onExportPdf = vi.fn();
    render(<StatusBar {...makeProps({ onExportPdf })} />);

    await userEvent.click(screen.getByRole("button", { name: "Export as PDF" }));
    expect(onExportPdf).toHaveBeenCalledOnce();
  });

  it("renders both export buttons with accessible names", () => {
    render(<StatusBar {...makeProps()} />);
    expect(screen.getByLabelText("Export as HTML")).toBeInTheDocument();
    expect(screen.getByLabelText("Export as PDF")).toBeInTheDocument();
  });
});
