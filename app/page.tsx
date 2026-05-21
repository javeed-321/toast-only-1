import EditorPane from "./components/EditorPane";
import MarkdownDocs from "./components/MarkDownDocs";

// Server Component: the route itself ships no client JS. Only <EditorPane>
// (marked "use client") hydrates; <MarkdownDocs> stays server-rendered, so its
// indexable copy is in the initial HTML at zero hydration cost.
export default function Page() {
  return (
    <>
      <EditorPane />
      <MarkdownDocs />
    </>
  );
}
