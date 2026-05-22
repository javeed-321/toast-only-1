import { describe, it, expect } from "vitest";
import { getMarkdownStats } from "./markdown-stats";

describe("getMarkdownStats", () => {
  it("returns zeros-ish for an empty string", () => {
    // No bytes, no words; an empty string still counts as one line because
    // "".split("\n") === [""].
    expect(getMarkdownStats("")).toEqual({ bytes: 0, words: 0, lines: 1 });
  });

  it("counts bytes, words, and lines for a simple sentence", () => {
    expect(getMarkdownStats("hello world")).toEqual({
      bytes: 11,
      words: 2,
      lines: 1,
    });
  });

  it("counts lines by newline separators", () => {
    expect(getMarkdownStats("a\nb\nc").lines).toBe(3);
    expect(getMarkdownStats("one line").lines).toBe(1);
    // A trailing newline opens a new (empty) line.
    expect(getMarkdownStats("a\n").lines).toBe(2);
  });

  it("collapses runs of whitespace when counting words", () => {
    expect(getMarkdownStats("  foo   bar\tbaz\n\nqux  ").words).toBe(4);
  });

  it("treats whitespace-only input as zero words", () => {
    expect(getMarkdownStats("   \n\t  ").words).toBe(0);
  });

  it("measures bytes, not characters, for multi-byte content", () => {
    // "é" is two bytes in UTF-8, "😀" is four. Blob size reflects encoded bytes.
    expect(getMarkdownStats("é").bytes).toBe(2);
    expect(getMarkdownStats("😀").bytes).toBe(4);
  });

  it("counts emoji separated by spaces as words", () => {
    expect(getMarkdownStats("😀 🚀").words).toBe(2);
  });
});
