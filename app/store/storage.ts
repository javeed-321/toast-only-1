// redux-persist storage engine backed by localStorage. localStorage is
// synchronous, but redux-persist expects a Promise-based API, so each method is
// wrapped to resolve/reject through a Promise. Writes still only happen after
// the editor's typing debounce (see components/EditorPane.tsx), so the
// synchronous main-thread write fires at most once per pause in typing.
//
// The store module is evaluated during SSR of the client Provider, where
// `window`/localStorage don't exist, so fall back to a noop storage on the
// server.
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

function createLocalStorage(): PersistStorage {
  return {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) =>
      Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
  };
}

const isClient = typeof window !== "undefined";

const storage: PersistStorage = isClient
  ? createLocalStorage()
  : createNoopStorage();

export default storage;
