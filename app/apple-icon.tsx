import { ImageResponse } from "next/og";

// Apple touch icon (iOS home screen / Safari pinned tab). 180x180 PNG,
// generated at request time — same Markdown mark and gradient as icon.svg.
// Full-bleed (no rounded corners): iOS applies its own rounded mask.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// White Markdown mark; embedded as a data-URI image (reliably rendered by
// next/og). Keep the path in sync with app/icon.svg.
const mark = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 208 128'><path fill='#fff' d='M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39H30zM155 98l-30-33h20V30h20v35h20z'/></svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={120}
          height={74}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(mark)}`}
          alt=""
        />
      </div>
    ),
    size
  );
}
