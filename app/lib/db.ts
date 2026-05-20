import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "mdx-editor";
const DB_VERSION = 1;
const DOCS_STORE = "docs";

const CURRENT_DOC_ID = "current"; // single-doc mode for now

type DocRow = {
  id: string;
  body: string;
  updatedAt: number;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
    if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB only available in browser"));
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(DOCS_STORE)) {
          db.createObjectStore(DOCS_STORE, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function loadCurrentDoc(): Promise<string | null> {
  const db = await getDb();
  const row = (await db.get(DOCS_STORE, CURRENT_DOC_ID)) as DocRow | undefined;
  return row?.body ?? null;
}

export async function saveCurrentDoc(body: string): Promise<void> {
  const db = await getDb();
  const row: DocRow = { id: CURRENT_DOC_ID, body, updatedAt: Date.now() };
  await db.put(DOCS_STORE, row);
}
