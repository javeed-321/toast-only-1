import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScrollToggle from "./ScrollToggle";

// ScrollToggle attaches to the markdown editor's scrollable ProseMirror surface.
// We stand in a fake scroller in the DOM so the effect can find it.
function mountScroller({
  scrollHeight,
  clientHeight,
  scrollTop,
}: {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
}) {
  const container = document.createElement("div");
  container.className = "toastui-editor-md-container";
  const pm = document.createElement("div");
  pm.className = "ProseMirror";
  container.appendChild(pm);
  document.body.appendChild(container);

  // jsdom reports 0 for layout props; define them explicitly.
  Object.defineProperty(pm, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(pm, "clientHeight", { value: clientHeight, configurable: true });
  pm.scrollTop = scrollTop;
  pm.scrollTo = vi.fn();
  return pm;
}

describe("ScrollToggle", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders nothing until the editor is ready", () => {
    const { container } = render(<ScrollToggle ready={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a 'scroll to bottom' control when near the top", () => {
    mountScroller({ scrollHeight: 1000, clientHeight: 200, scrollTop: 0 });
    render(<ScrollToggle ready />);
    expect(
      screen.getByRole("button", { name: "Scroll to bottom" })
    ).toBeInTheDocument();
  });

  it("flips to 'scroll to top' once scrolled past the halfway mark", () => {
    const pm = mountScroller({ scrollHeight: 1000, clientHeight: 200, scrollTop: 0 });
    render(<ScrollToggle ready />);

    // max = 1000 - 200 = 800; halfway = 400. Move past it and fire scroll.
    // Wrap in act() so React flushes the setNearTop update from this native
    // (non-React) event before we assert.
    act(() => {
      pm.scrollTop = 600;
      pm.dispatchEvent(new Event("scroll"));
    });

    expect(
      screen.getByRole("button", { name: "Scroll to top" })
    ).toBeInTheDocument();
  });

  it("scrolls to the bottom when clicked near the top", async () => {
    const pm = mountScroller({ scrollHeight: 1000, clientHeight: 200, scrollTop: 0 });
    render(<ScrollToggle ready />);

    await userEvent.click(screen.getByRole("button", { name: "Scroll to bottom" }));
    expect(pm.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "auto" });
  });

  it("scrolls to the top when clicked near the bottom", async () => {
    const pm = mountScroller({ scrollHeight: 1000, clientHeight: 200, scrollTop: 600 });
    render(<ScrollToggle ready />);

    await userEvent.click(screen.getByRole("button", { name: "Scroll to top" }));
    expect(pm.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
