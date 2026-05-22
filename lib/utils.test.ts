import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins plain class strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values (clsx behaviour)", () => {
    expect(cn("a", false, null, undefined, 0 as never, "b")).toBe("a b");
  });

  it("supports conditional object syntax", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("flattens arrays of class values", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("merges conflicting Tailwind utilities, keeping the last one", () => {
    // This is the whole reason for twMerge over plain clsx.
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-black", "text-white")).toBe("text-white");
  });

  it("keeps non-conflicting Tailwind utilities side by side", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("returns an empty string for no/empty input", () => {
    expect(cn()).toBe("");
    expect(cn("", null, undefined)).toBe("");
  });
});
