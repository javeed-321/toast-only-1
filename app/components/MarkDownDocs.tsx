import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── documentation.ai palette (from app/document.css / document.html) ──
// Exact colors matched from the Framer export's design tokens:
//   heading #09090b · body #5e5e5e · faint #959595 · accent (orange) #f97d00
//   primary btn #000/white (pill) · secondary btn #f5f3f1/#000 (pill)
//   surfaces: white / #f8f8f8 · cards #fcfcfc with #ebebeb borders · icon chip #f8f4e5

// Static, server-rendered content below the editor.
// Doubles as SEO content (real indexable text + headings) and a usage guide.
// Rebuilt on shadcn/ui: `Card` is used directly (it's hook-free, so this stays
// a server component for SEO), while link/label styling reuses shadcn's
// `buttonVariants` / `badgeVariants` on plain <a>/<span> elements.

const AUDIENCES = [
  {
    num: "01",
    title: "Writers & Bloggers",
    text: "Draft posts in clean Markdown and preview the formatted result instantly. Export to HTML or PDF when you're ready to publish.",
  },
  {
    num: "02",
    title: "Developers",
    text: "Write READMEs, docs, and code-heavy notes with syntax-highlighted code blocks for 35+ languages and GitHub-style tables.",
  },
  {
    num: "03",
    title: "Students & Researchers",
    text: "Take structured notes with headings, task lists, and LaTeX math rendered beautifully via KaTeX — perfect for study and reports.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Type or paste Markdown",
    text: "Start writing in the editor on the left using standard Markdown syntax, or paste in an existing document.",
  },
  {
    num: "2",
    title: "See the live preview",
    text: "The right pane renders your Markdown as you type, with scroll syncing so both sides stay aligned.",
  },
  {
    num: "3",
    title: "Export your document",
    text: "Click Export to download polished HTML or a print-ready PDF — no sign-up, no watermark.",
  },
];

const FEATURES = [
  {
    icon: "⇄",
    title: "Live Side-by-Side Preview",
    text: "See exactly how your Markdown renders as you type, with synchronized scrolling between the editor and preview.",
  },
  {
    icon: "✦",
    title: "Rich Formatting Support",
    text: "Tables, task lists, code blocks, blockquotes, images, links, and LaTeX math — everything modern Markdown offers.",
  },
  {
    icon: "↓",
    title: "HTML & PDF Export",
    text: "Turn your document into a clean, self-contained HTML file or a print-ready PDF in a single click.",
  },
  {
    icon: "◐",
    title: "Dark Mode",
    text: "Switch between light and dark themes for comfortable writing in any lighting condition.",
  },
];

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f4e5] text-base text-[#f97d00]">
      {children}
    </span>
  );
}

// Eyebrow label matching the documentation.ai hero: an orange dot + uppercase
// monospace text. `center` centers it (hero + centered section headers).
function Eyebrow({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", center && "justify-center")}>
      <span className="size-1.5 shrink-0 rounded-full bg-[#f97d00]" />
      <span className="font-mono text-[12px] uppercase tracking-[0.02em] text-[#5e5e5e]">
        {children}
      </span>
    </div>
  );
}

export default function MarkdownDocs() {
  return (
    <section className="bg-white text-[#09090b]">
      {/* ── Hero ── */}
      <div className="bg-white py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex justify-center">
            <Eyebrow center>100% Free · No Sign-Up · Private</Eyebrow>
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#09090b] md:text-[3.25rem]">
            Free Online <span className="text-[#f97d00]">Markdown Editor</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#5e5e5e] md:text-xl">
            Write Markdown on the left and see it rendered live on the right.
            Syntax highlighting, tables, math, task lists, dark mode, and
            one-click HTML &amp; PDF export — all in your browser, with nothing
            sent to a server.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#editor"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-full bg-[#000] px-6 text-white hover:bg-[#1d1816]"
              )}
            >
              Start Writing — It&apos;s Free ↑
            </a>
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full border-transparent bg-[#f5f3f1] px-6 text-[#000] hover:bg-[#ebebeb]"
              )}
            >
              See How It Works ↓
            </a>
          </div>
        </div>
      </div>

      {/* ── Audience Cards ── */}
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="mb-3">
          <Eyebrow center>Built For</Eyebrow>
        </div>
        <h2 className="text-center text-2xl font-bold text-[#09090b] md:text-3xl">
          One Editor, Every Workflow
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {AUDIENCES.map((card) => (
            <Card
              key={card.num}
              className="rounded-2xl border-[#ebebeb] bg-[#fcfcfc] shadow-none"
            >
              <CardHeader>
                <span className="font-mono text-xs font-bold text-[#f97d00]">
                  {card.num}
                </span>
                <CardTitle className="mt-1 text-base font-semibold text-[#09090b]">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-[#5e5e5e]">
                {card.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <div id="how-it-works" className="bg-[#f8f8f8] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-3">
            <Eyebrow>Getting Started</Eyebrow>
          </div>
          <h2 className="text-2xl font-bold text-[#09090b] md:text-3xl">
            How Does the Markdown Editor Work?
          </h2>

          <div className="mt-10 space-y-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-start gap-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#000] text-sm font-bold text-white">
                  {step.num}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#09090b]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5e5e5e]">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="mb-3">
          <Eyebrow>Features</Eyebrow>
        </div>
        <h2 className="text-2xl font-bold text-[#09090b] md:text-3xl">
          Why Choose Our Markdown Editor?
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="rounded-2xl border-[#ebebeb] bg-[#fcfcfc] shadow-none"
            >
              <CardHeader>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <CardTitle className="mt-4 text-base font-semibold text-[#09090b]">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-[#5e5e5e]">
                {f.text}
              </CardContent>
            </Card>
          ))}

          {/* Full-width privacy card */}
          <Card className="rounded-2xl border-[#ebebeb] bg-[#fcfcfc] shadow-none sm:col-span-2">
            <CardContent className="flex items-start gap-5">
              <FeatureIcon>◉</FeatureIcon>
              <div>
                <h3 className="text-base font-semibold text-[#09090b]">
                  Private by Design
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5e5e5e]">
                  Your document is saved locally in your browser and never
                  uploaded. Your writing stays on your device.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── About ── */}
      <div className="bg-[#f8f8f8] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-[#09090b] md:text-3xl">About</h2>
          <p className="mt-4 text-base leading-relaxed text-[#5e5e5e]">
            This is a free, browser-based Markdown editor built for writers,
            developers, and students who want a fast, distraction-free way to
            write and preview Markdown. No account required.
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <Separator className="bg-[#ebebeb]" />
      <footer className="bg-white py-8 text-center text-sm text-[#959595]">
        <p className="text-[#5e5e5e]">
          by{" "}
          <a
            href="https://documentation.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#f97d00] hover:underline"
          >
            Documentation.AI
          </a>{" "}
          — Create and maintain world-class documentation built for both humans
          and AI
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Markdown Editor. All rights reserved.
        </p>
      </footer>
    </section>
  );
}
