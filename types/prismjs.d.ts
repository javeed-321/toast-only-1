// prismjs ships no bundled types and we don't need @types/prismjs just to load
// it. Declare the core module and the language-component side-effect imports.
declare module "prismjs" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Prism: any;
  export default Prism;
}

// Language components are side-effect imports that extend the global Prism.
declare module "prismjs/components/*";
