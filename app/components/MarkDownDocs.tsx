import "../styles/docs.css";

// Static, server-rendered content below the editor.
// Doubles as SEO content (real indexable text + headings) and a usage guide.
export default function MarkdownDocs() {
  return (
    <section className="md-docs">
      {/* Hero */}
      <div className="md-docs__inner">
        <h1 className="md-docs__title">Free Online Markdown Editor</h1>
        <p className="md-docs__lead">
          Write Markdown on the left and see it rendered live on the right.
          Syntax highlighting, tables, math, task lists, dark mode, and one-click
          HTML &amp; PDF export — all in your browser, with nothing sent to a server.
        </p>

        {/* Audience cards */}
        <div className="md-docs__cards">
          <div className="md-docs__card">
            <h3 className="md-docs__card-title">Writers &amp; Bloggers</h3>
            <p className="md-docs__card-text">
              Draft posts in clean Markdown and preview the formatted result
              instantly. Export to HTML or PDF when you&apos;re ready to publish.
            </p>
          </div>
          <div className="md-docs__card">
            <h3 className="md-docs__card-title">Developers</h3>
            <p className="md-docs__card-text">
              Write READMEs, docs, and code-heavy notes with syntax-highlighted
              code blocks for 35+ languages and GitHub-style tables.
            </p>
          </div>
          <div className="md-docs__card">
            <h3 className="md-docs__card-title">Students &amp; Researchers</h3>
            <p className="md-docs__card-text">
              Take structured notes with headings, task lists, and LaTeX math
              rendered beautifully via KaTeX — perfect for study and reports.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="md-docs__section">
        <h2 className="md-docs__h2">How Does the Markdown Editor Work?</h2>
        <p className="md-docs__sub">Getting started takes three steps:</p>

        <div className="md-docs__steps">
          <div className="md-docs__step">
            <div className="md-docs__step-num">1</div>
            <div>
              <p className="md-docs__step-title">Type or paste Markdown</p>
              <p className="md-docs__step-text">
                Start writing in the editor on the left using standard Markdown
                syntax, or paste in an existing document.
              </p>
            </div>
          </div>
          <div className="md-docs__step">
            <div className="md-docs__step-num">2</div>
            <div>
              <p className="md-docs__step-title">See the live preview</p>
              <p className="md-docs__step-text">
                The right pane renders your Markdown as you type, with scroll
                syncing so both sides stay aligned.
              </p>
            </div>
          </div>
          <div className="md-docs__step">
            <div className="md-docs__step-num">3</div>
            <div>
              <p className="md-docs__step-title">Export your document</p>
              <p className="md-docs__step-text">
                Click Export to download polished HTML or a print-ready PDF — no
                sign-up, no watermark.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose */}
      <div className="md-docs__section">
        <h2 className="md-docs__h2">Why Choose Our Markdown Editor?</h2>
        <div className="md-docs__features">
          <div className="md-docs__feature">
            <h3 className="md-docs__feature-title">Live Side-by-Side Preview</h3>
            <p className="md-docs__feature-text">
              See exactly how your Markdown renders as you type, with synchronized
              scrolling between the editor and preview.
            </p>
          </div>
          <div className="md-docs__feature">
            <h3 className="md-docs__feature-title">Rich Formatting Support</h3>
            <p className="md-docs__feature-text">
              Tables, task lists, code blocks, blockquotes, images, links, and
              LaTeX math — everything modern Markdown offers.
            </p>
          </div>
          <div className="md-docs__feature">
            <h3 className="md-docs__feature-title">HTML &amp; PDF Export</h3>
            <p className="md-docs__feature-text">
              Turn your document into a clean, self-contained HTML file or a
              print-ready PDF in a single click.
            </p>
          </div>
          <div className="md-docs__feature">
            <h3 className="md-docs__feature-title">Dark Mode</h3>
            <p className="md-docs__feature-text">
              Switch between light and dark themes for comfortable writing in any
              lighting condition.
            </p>
          </div>
          <div className="md-docs__feature">
            <h3 className="md-docs__feature-title">Private by Design</h3>
            <p className="md-docs__feature-text">
              Your document is saved locally in your browser and never uploaded.
              Your writing stays on your device.
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="md-docs__about">
        <h2 className="md-docs__h2">About</h2>
        <p className="md-docs__about-text">
          This is a free, browser-based Markdown editor built for writers,
          developers, and students who want a fast, distraction-free way to write
          and preview Markdown. No account required.
        </p>
      </div>

      <footer className="md-docs__footer">
        <p>© {new Date().getFullYear()} Markdown Editor. All rights reserved.</p>
      </footer>
    </section>
  );
}
