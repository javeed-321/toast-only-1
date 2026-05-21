import localforage from "localforage";

// redux-persist storage engine backed by IndexedDB (via localforage). Unlike
// localStorage, reads/writes are asynchronous and run off the main thread, so
// saving a large document no longer blocks typing. This is the async,
// large-quota persistence the old `idb` setup had — now driven by Redux.
//
// The store module is evaluated during SSR of the client Provider, where
// `window`/IndexedDB don't exist, so fall back to a noop storage on the server.
type PersistStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
  removeItem(key: string): Promise<void>;
};

function createNoopStorage(): PersistStorage {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
}

const isClient = typeof window !== "undefined";

const storage: PersistStorage = isClient
  ? localforage.createInstance({
      name: "mdx-editor",
      storeName: "doc",
      driver: localforage.INDEXEDDB,
    })
  : createNoopStorage();

export default storage;
