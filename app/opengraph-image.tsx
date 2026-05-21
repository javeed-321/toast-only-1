import { ImageResponse } from "next/og";

// Open Graph / Twitter share image, generated at request time with next/og.
// No static asset to keep in sync and no broken links — Next auto-wires the
// resulting <meta property="og:image"> (and Twitter falls back to it).
export const alt = "Online Markdown Editor — free, ad free, no signup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          // Mirrors the editor's dark surface palette.
          background: "#1e1e1e",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          Online Markdown Editor
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 24,
          }}
        >
          Write Markdown. See it live.
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#d1d5db",
            marginTop: 28,
          }}
        >
          Free · Ad free · No signup · Export to HTML & PDF
        </div>
      </div>
    ),
    size
  );
}
