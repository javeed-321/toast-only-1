import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./store/Providers";
import InstallPrompt from "./components/InstallPrompt";

// Production origin used to build absolute URLs for canonical/OG/Twitter tags
// and the sitemap. This MUST be your real, publicly reachable domain: social
// scrapers fetch og:image from this exact origin, so a wrong/hardcoded value
// makes the share preview come up blank. Resolution order:
//   1. NEXT_PUBLIC_SITE_URL — set this in your deploy env to your real domain
//      (e.g. https://your-domain.com). Always wins; use it for custom domains.
//   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production domain, so the
//      origin is correct automatically on Vercel without hardcoding a project.
//   3. http://localhost:3000 — dev fallback (scrapers can't read localhost).
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

// Body / UI / headings — Inter. Exposed as `--font-inter` (→ `--font-sans`).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Code / monospace — JetBrains Mono. Exposed as `--font-jetbrains-mono` (→ `--font-mono`).
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const title = "Online Markdown Editor | Free, Ad Free & No Signup";
const description =
  "A fast, free online Markdown editor with live WYSIWYG preview, offline " +
  "autosave, and one-click export to HTML or PDF. No signup, no ads, no " +
  "tracking — everything runs in your browser.";

export const metadata: Metadata = {
  // Lets the canonical/OG/Twitter/sitemap URLs below be written as relative
  // paths; Next resolves them against this origin.
  metadataBase: new URL(siteUrl),
  title: {
    // Home page uses this verbatim; future routes get "<Page> | Online Markdown Editor".
    default: title,
    template: "%s | Online Markdown Editor",
  },
  description,
  applicationName: "Online Markdown Editor",
  // Real search phrases a writer would type — kept tight to avoid keyword
  // stuffing (modern engines largely ignore this tag, but it's harmless here).
  keywords: [
    "online markdown editor",
    "free markdown editor",
    "markdown editor",
    "markdown preview",
    "live markdown preview",
    "wysiwyg markdown editor",
    "markdown to pdf",
    "markdown to html",
    "browser markdown editor",
    "no signup markdown editor",
    "ad free markdown editor",
  ],
  category: "technology",
  authors: [{ name: "Online Markdown Editor" }],
  creator: "Online Markdown Editor",
  publisher: "Online Markdown Editor",
  // Single-page app: the home page is the canonical URL for the whole site.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Online Markdown Editor",
    title,
    description,
    url: "/",
    locale: "en_US",
    // Image is provided by app/opengraph-image.tsx (auto-wired by Next).
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    // No explicit twitter:image — X falls back to the Open Graph image above.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// themeColor lives in the viewport export (deprecated in `metadata` since
// Next 14). Matches the editor surfaces so mobile browser chrome blends in:
// white in light mode, #1e1e1e in dark.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
};

// Structured data (Schema.org SoftwareApplication) so search engines can show
// rich results — app category, price (free), and platform. Rendered as a
// JSON-LD <script> in <body>; values stay in sync with the metadata above.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Online Markdown Editor",
  description,
  url: siteUrl,
  applicationCategory: "Editor",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires JavaScript and a modern web browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Live WYSIWYG Markdown preview",
    "Offline autosave",
    "Export to HTML",
    "Export to PDF",
    "Syntax-highlighted code blocks",
    "No signup, no ads, no tracking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Apply the saved theme before first paint to avoid a white flash on
            reload. beforeInteractive injects this into the initial HTML so it
            runs before React hydrates, without React's "script tag" warning. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem("theme")==="true"){document.documentElement.classList.add("dark")}}catch(e){}`}
        </Script>
        {/* JSON-LD structured data for rich search results. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        {/* Bottom-right "Add to home screen?" toast (Chromium installable). */}
        <InstallPrompt />
      </body>
    </html>
  );
}
