"use client";

import dynamic from "next/dynamic";

// CSR-only app (per requirement): both the editor and the docs are loaded with
// `ssr: false`, so the server emits no markup for them — everything renders in
// the browser. The page itself is a Client Component so it's allowed to use
// `dynamic({ ssr: false })`. Page-level <head>/SEO metadata still lives in
// app/layout.tsx (a Server Component), which is the document shell, not content.
//
// NOTE: rendering the docs client-side removes their text from the initial HTML,
// so search engines / crawlers won't see that content without executing JS. That
// is the inherent trade-off of CSR-only and is the accepted requirement here.
const EditorPane = dynamic(() => import("./components/EditorPane"), {
  ssr: false,
});
const MarkdownDocs = dynamic(() => import("./components/MarkDownDocs"), {
  ssr: false,
});

export default function Page() {
  return (
    <>
      <EditorPane />
      <MarkdownDocs />
    </>
  );
}
