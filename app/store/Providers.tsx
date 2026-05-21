"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./index";

// Client-only Redux wrapper. PersistGate holds rendering until the persisted
// document has been rehydrated from localStorage, so the editor mounts with the
// saved body already in the store (no flash of seed content on refresh).
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
