import type { MetadataRoute } from "next";

// Web App Manifest (served at /manifest.webmanifest, auto-linked by Next).
// Makes the editor installable as a desktop/home-screen app — which is what
// powers the "Add to home screen" prompt (see components/InstallPrompt).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Online Markdown Editor",
    short_name: "Markdown",
    description:
      "A fast, free online Markdown editor with live preview and export to " +
      "HTML or PDF. No signup, no ads — runs entirely in your browser.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      // Scalable icon (app/icon.svg) — Chromium accepts `sizes: "any"` SVG for
      // installability.
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      // PNG fallback (app/apple-icon.tsx) for platforms that want a raster icon.
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
