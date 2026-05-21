import { ImageResponse } from "next/og";

// Open Graph / Twitter share image, generated at request time with next/og.
// Light theme (matches the editor's light surface) with the brand mark + text.
// Next auto-wires <meta property="og:image"> and <meta name="twitter:image">,
// so the same card shows across every platform that reads Open Graph or
// Twitter Cards: Facebook, LinkedIn, WhatsApp, Slack, Discord, Telegram,
// Pinterest, X/Twitter, etc.
export const alt = "Online Markdown Editor — free, ad free, no signup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The logo tile (brand-accent rounded square + white Markdown mark), identical
// to app/icon.svg. Embedded as a data URI so next/og can render it as an image.
const logo = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' rx='28' fill='#f97d00'/><path transform='translate(4.9 28.8) scale(0.55)' d='M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39H30zM155 98l-30-33h20V30h20v35h20z' fill='#ffffff'/></svg>`;

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
          padding: "90px",
          // Light surface matching the documentation.ai landing design.
          background: "#ffffff",
          color: "#09090b",
        }}
      >
        {/* Logo + product name */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width={120}
            height={120}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(logo)}`}
            alt=""
          />
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#5e5e5e",
              marginLeft: 28,
            }}
          >
            Online Markdown Editor
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 44,
          }}
        >
          Write Markdown. See it live.
        </div>

        {/* Tagline */}
        <div style={{ display: "flex", fontSize: 36, marginTop: 28 }}>
          <span style={{ color: "#f97d00", fontWeight: 600 }}>
            Free · Ad free · No signup
          </span>
          <span style={{ color: "#5e5e5e", marginLeft: 14 }}>
            · Export to HTML & PDF
          </span>
        </div>

        {/* Accent bar for a bit of visual weight on the light background. */}
        <div
          style={{
            display: "flex",
            width: 220,
            height: 10,
            marginTop: 56,
            borderRadius: 5,
            background: "#f97d00",
          }}
        />
      </div>
    ),
    size
  );
}
