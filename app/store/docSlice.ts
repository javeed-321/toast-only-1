import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mdContent } from "../lib/content";

type DocState = {
  body: string;
  updatedAt: number;
};

// Seed with the demo markdown on first load. redux-persist rehydrates the saved
// body over this on subsequent visits (see store/index.ts).
const initialState: DocState = {
  body: mdContent,
  updatedAt: Date.now(),
};

const docSlice = createSlice({
  name: "doc",
  initialState,
  reducers: {
    setBody(state, action: PayloadAction<string>) {
      state.body = action.payload;
      state.updatedAt = Date.now();
    },
  },
});

export const { setBody } = docSlice.actions;
export default docSlice.reducer;
