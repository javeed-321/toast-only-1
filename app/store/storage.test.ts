import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// storage.ts decides at module-load time whether it's running on the client
// (localStorage-backed) or the server (a noop fallback used during SSR of the
// Provider). We exercise both branches by controlling `window` and re-importing
// the module fresh each time.
describe("storage engine", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exposes the redux-persist storage interface on the client", async () => {
    // jsdom defines `window`, so this is the client branch.
    const { default: storage } = await import("./storage");
    expect(typeof storage.getItem).toBe("function");
    expect(typeof storage.setItem).toBe("function");
    expect(typeof storage.removeItem).toBe("function");
  });

  it("reads and writes through localStorage on the client", async () => {
    const { default: storage } = await import("./storage");
    await storage.setItem("mdx-editor", "hello");
    await expect(storage.getItem("mdx-editor")).resolves.toBe("hello");
    await storage.removeItem("mdx-editor");
    await expect(storage.getItem("mdx-editor")).resolves.toBeNull();
  });

  it("falls back to a noop storage when window is undefined (SSR)", async () => {
    vi.stubGlobal("window", undefined);
    const { default: storage } = await import("./storage");

    // The noop reads resolve to null and writes resolve without throwing.
    await expect(storage.getItem("any-key")).resolves.toBeNull();
    await expect(storage.setItem("k", "v")).resolves.toBeUndefined();
    await expect(storage.removeItem("k")).resolves.toBeUndefined();
  });
});
