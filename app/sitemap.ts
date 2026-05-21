import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";

// Last date the page's content actually changed. Bump this when you meaningfully
// edit the page (copy, features, docs) — NOT on every deploy. Using `new Date()`
// here would report "modified today" on each build, churning the freshness
// signal and training crawlers to ignore it.
const CONTENT_LAST_MODIFIED = "2026-05-21";

// Served at /sitemap.xml. Single-page app, so just the home route for now —
// add entries here as new routes are introduced.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
