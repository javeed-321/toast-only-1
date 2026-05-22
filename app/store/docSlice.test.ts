import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import reducer, { setBody } from "./docSlice";
import { mdContent } from "../lib/content";

describe("docSlice", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("seeds the initial state with the demo markdown", () => {
    // Passing undefined state + a no-op action yields the initialState.
    const state = reducer(undefined, { type: "@@INIT" });
    expect(state.body).toBe(mdContent);
    expect(typeof state.updatedAt).toBe("number");
  });

  it("setBody replaces the body", () => {
    const start = { body: "old", updatedAt: 0 };
    const next = reducer(start, setBody("new body"));
    expect(next.body).toBe("new body");
  });

  it("setBody stamps updatedAt with the current time", () => {
    vi.setSystemTime(new Date("2026-05-22T12:00:00Z"));
    const expected = Date.now();
    const next = reducer({ body: "x", updatedAt: 0 }, setBody("y"));
    expect(next.updatedAt).toBe(expected);
  });

  it("does not mutate the previous state (Immer produces a new object)", () => {
    const start = { body: "old", updatedAt: 123 };
    const next = reducer(start, setBody("new"));
    expect(start.body).toBe("old");
    expect(next).not.toBe(start);
  });

  it("handles an empty-string body", () => {
    const next = reducer({ body: "something", updatedAt: 0 }, setBody(""));
    expect(next.body).toBe("");
  });

  it("exposes a correctly-typed action creator", () => {
    expect(setBody("hi")).toEqual({ type: "doc/setBody", payload: "hi" });
  });
});
