import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage"; // localStorage-backed redux-persist engine
import docReducer from "./docSlice";

const rootReducer = combineReducers({
  doc: docReducer,
});

// Persist the document to localStorage so it survives a refresh. The editor's
// typing debounce (see components/EditorPane.tsx) keeps writes infrequent.
// key "mdx-editor" mirrors the previous storage name.
const persistConfig = {
  key: "mdx-editor",
  storage,
  whitelist: ["doc"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable actions; ignore them.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
