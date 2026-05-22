import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Vitest config for the unit + component suite. `vite-tsconfig-paths` resolves
// the `@/*` alias from tsconfig.json so imports like `@/components/ui/button`
// work the same way they do under Next. jsdom gives us a DOM for RTL.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Only pick up our test files; never reach into next/.next build output.
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
  },
});
