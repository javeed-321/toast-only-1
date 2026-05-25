"use client"
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
    text: "Take structured notes with headings, task lists.",
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

// Question-shaped Q&A — the highest-leverage AEO surface. Rendered as visible
// text below AND emitted as FAQPage JSON-LD (built from this same array, so the
// markup and structured data can never drift). Answers lead with a direct
// "Yes/No" claim an answer engine can lift verbatim.
const FAQS = [
  {
    q: "Is this Markdown editor free?",
    a: "Yes — it's 100% free with no signup, no ads, and no usage limits. Every feature, including HTML and PDF export, is available without paying.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. There's no sign-up or login — open the page and start writing immediately.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. After the first load the editor runs entirely in your browser, and your document autosaves locally, so you can keep writing without an internet connection.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your document is saved locally in your browser and is never uploaded to a server. Your writing stays on your device.",
  },
  {
    q: "Can I export to PDF?",
    a: "Yes. One click exports your document as a print-ready PDF, and another exports a clean, self-contained HTML file — both generated in your browser.",
  },
  {
    q: "Which Markdown features are supported?",
    a: "Headings, tables, task lists, fenced code blocks with syntax highlighting for 35+ languages, blockquotes, images, links.",
  },
];

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f8f4e5] dark:bg-white dark:bg-[#1e1e1e]/10 text-base text-[#f97d00]">
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
      <span className="font-mono text-[12px] uppercase tracking-[0.02em] text-[#5e5e5e] dark:text-white/70">
        {children}
      </span>
    </div>
  );
}

// FAQPage structured data, built from FAQS so it always matches the visible Q&A
// (Google requires the rendered text and the schema to be the same).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// HowTo structured data, built from the same STEPS the "How It Works" section
// renders — directly extractable by answer engines.
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo Export PDF",
  name: "How to use the Online Markdown Editor",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.text,
  })),
};

export default function MarkdownDocs() {
  return (
    <div className="bg-white dark:bg-[#1e1e1e] text-[#09090b] dark:text-white">
      {/* AEO structured data — kept in sync with the rendered FAQ / steps. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      {/* ── Brand callout ── highlighted "built by" banner at the top, styled
          after the jam.dev utility pages: brand chip + "by X — tagline" + CTA. */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <a
          href="https://documentation.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4 rounded-2xl border border-[#ebebeb] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#262626] px-6 py-5 text-center transition-colors hover:border-[#f97d00]/50 sm:flex-row sm:justify-between sm:text-left md:px-8"
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            {/* Brand chip — mirrors the orange icon chips used below. */}
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f97d00] text-lg font-bold text-white">
              D
            </span>
            <p className="text-sm leading-relaxed text-[#5e5e5e] dark:text-white/70 sm:text-base">
              by{" "}
              <span className="font-semibold text-[#09090b] dark:text-white">
                Documentation.AI
              </span>{" "}
              — Create and maintain world-class documentation built for both
              humans and AI.
            </p>
          </div>

          <span
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 shrink-0 rounded-full bg-[#000] px-6 text-white group-hover:bg-[#1d1816] dark:bg-white dark:text-black dark:group-hover:bg-white/90"
            )}
          >
            Try Documentation.AI →
          </span>
        </a>
      </div>

      {/* ── Hero ── */}
      <header className="bg-white dark:bg-[#1e1e1e] py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex justify-center">
            <Eyebrow center>100% Free · No Sign-Up · Private</Eyebrow>
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[#09090b] dark:text-white md:text-[3.25rem]">
            Free Online <span className="text-[#f97d00]">Markdown Editor</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#5e5e5e] dark:text-white/70 md:text-xl">
            <strong className="font-semibold text-[#09090b] dark:text-white">
              Online Markdown Editor is a free, browser-based Markdown editor for
              writers, developers, and students.
            </strong>{" "}
            Write Markdown on the left and see it rendered live on the right —
            syntax highlighting, tables, math, task lists, dark mode, and
            one-click HTML &amp; PDF export, all in your browser with nothing
            sent to a server.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-full bg-[#000] px-6 text-white hover:bg-[#1d1816] dark:bg-white dark:text-black dark:hover:bg-white/90"
              )}
            >
              Start Writing — It&apos;s Free 
            </a>
            <a
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full border-transparent bg-[#f5f3f1] px-6 text-[#000] hover:bg-[#ebebeb] dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              )}
            >
              See How It Works 
            </a>
          </div>
        </div>
      </header>

      {/* ── Audience Cards ── */}
      <section
        aria-labelledby="audience-heading"
        className="mx-auto max-w-5xl px-6 py-16 md:py-20"
      >
        <div className="mb-3">
          <Eyebrow center>Built For</Eyebrow>
        </div>
        <h2
          id="audience-heading"
          className="text-center text-2xl font-bold text-[#09090b] dark:text-white md:text-3xl"
        >
          One Editor, Every Workflow
        </h2>

        {/* Answer-first lead: a self-contained sentence an answer engine can quote. */}
        <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-[#5e5e5e] dark:text-white/70">
          The Online Markdown Editor works for anyone who writes in Markdown —
          bloggers drafting posts, developers writing READMEs, and students
          taking notes — all in the same fast, distraction-free workspace.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {AUDIENCES.map((card) => (
            <Card
              key={card.num}
              className="rounded-2xl border-[#ebebeb] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#262626] shadow-none"
            >
              <CardHeader>
                <span className="font-mono text-xs font-bold text-[#f97d00]">
                  {card.num}
                </span>
                <CardTitle className="mt-1 text-base font-semibold text-[#09090b] dark:text-white">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-[#5e5e5e] dark:text-white/70">
                {card.text}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        aria-labelledby="how-heading"
        className="bg-[#f8f8f8] dark:bg-[#181818] py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-3">
            <Eyebrow>Getting Started</Eyebrow>
          </div>
          <h2
            id="how-heading"
            className="text-2xl font-bold text-[#09090b] dark:text-white md:text-3xl"
          >
            How Does the Markdown Editor Work?
          </h2>

          {/* Answer-first lead: a complete answer in two sentences. */}
          <p className="mt-4 text-base leading-relaxed text-[#5e5e5e] dark:text-white/70">
            The Markdown editor works in three steps: type or paste Markdown on
            the left, watch it render live on the right, then export the result
            as HTML or PDF. No setup, install, or sign-up is required.
          </p>

          {/* Ordered list — sequential steps, so an <ol> (not <div>s) is the
              correct semantics and mirrors the HowTo JSON-LD above. */}
          <ol className="mt-10 space-y-8">
            {STEPS.map((step) => (
              <li key={step.num} className="flex items-start gap-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#000] text-sm font-bold text-white dark:bg-white dark:text-black">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#09090b] dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5e5e5e] dark:text-white/70">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        aria-labelledby="features-heading"
        className="mx-auto max-w-5xl px-6 py-16 md:py-20"
      >
        <div className="mb-3">
          <Eyebrow>Features</Eyebrow>
        </div>
        <h2
          id="features-heading"
          className="text-2xl font-bold text-[#09090b] dark:text-white md:text-3xl"
        >
          Why Choose Our Markdown Editor?
        </h2>

        {/* Answer-first lead: leads with the claim, then the supporting detail. */}
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5e5e5e] dark:text-white/70">
          Choose this Markdown editor because it is free, private, and runs
          entirely in your browser — with live side-by-side preview, rich
          formatting, one-click HTML and PDF export, and dark mode, while nothing
          you write is ever sent to a server.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card
              key={f.title}
              className="rounded-2xl border-[#ebebeb] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#262626] shadow-none"
            >
              <CardHeader>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <CardTitle className="mt-4 text-base font-semibold text-[#09090b] dark:text-white">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-[#5e5e5e] dark:text-white/70">
                {f.text}
              </CardContent>
            </Card>
          ))}

          {/* Full-width privacy card */}
          <Card className="rounded-2xl border-[#ebebeb] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#262626] shadow-none sm:col-span-2">
            <CardContent className="flex items-start gap-5">
              <FeatureIcon>◉</FeatureIcon>
              <div>
                <h3 className="text-base font-semibold text-[#09090b] dark:text-white">
                  Private by Design
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5e5e5e] dark:text-white/70">
                  Your document is saved locally in your browser and never
                  uploaded. Your writing stays on your device.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="mx-auto max-w-3xl px-6 py-16 md:py-20"
      >
        <div className="mb-3">
          <Eyebrow>FAQ</Eyebrow>
        </div>
        <h2
          id="faq-heading"
          className="text-2xl font-bold text-[#09090b] dark:text-white md:text-3xl"
        >
          Frequently Asked Questions
        </h2>

        <div className="mt-10 space-y-8">
          {FAQS.map((item) => (
            <div key={item.q}>
              <h3 className="text-base font-semibold text-[#09090b] dark:text-white">
                {item.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5e5e5e] dark:text-white/70">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section
        aria-labelledby="about-heading"
        className="bg-[#f8f8f8] dark:bg-[#181818] py-16 md:py-20"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2
            id="about-heading"
            className="text-2xl font-bold text-[#09090b] dark:text-white md:text-3xl"
          >
            About
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5e5e5e] dark:text-white/70">
            Online Markdown Editor is 100% free, requires no account, and runs
            entirely in your browser. It&apos;s built for writers, developers,
            and students who want a fast, distraction-free way to write and
            preview Markdown.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <Separator className="bg-[#ebebeb] dark:bg-white/10" />
      <footer className="bg-white dark:bg-[#1e1e1e] py-8 text-center text-sm text-[#959595] dark:text-white/50">
        <p>
          © {new Date().getFullYear()} Markdown Editor. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
