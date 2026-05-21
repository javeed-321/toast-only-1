import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";

// Served at /sitemap.xml. Single-page app, so just the home route for now —
// add entries here as new routes are introduced.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
