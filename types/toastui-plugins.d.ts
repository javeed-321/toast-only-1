// The code-syntax-highlight plugin ships no types for its deep `/dist/*-all.js`
// entry point, so declare it as a Toast UI editor plugin factory.
declare module "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const codeSyntaxHighlight: (...args: any[]) => any;
  export default codeSyntaxHighlight;
}
