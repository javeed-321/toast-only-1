import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees and reset jsdom between tests so component tests don't
// leak DOM into one another.
afterEach(() => {
  cleanup();
});
