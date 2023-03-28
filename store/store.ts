import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import counterReducer from "./features/counter/counterSlice";
import selectSlice from "./features/select/selectedSlice";

import { create } from "zustand";
import { ProductResponseSuccess } from "../lib/supabase";
import { ProductSlice, createProductSlice } from "./productSlice";

type SelectedState = {
  isSelected?: boolean;
  //images?: any;
} & ProductResponseSuccess;

interface State {
  products: SelectedState[];
  selected: SelectedState[];
  setProducts: (product: SelectedState[] | undefined) => void;
  updateAProduct: (index: number, product: SelectedState) => void;
  test?: () => void;
}
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authSlice,
    select: selectSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useBoundStore = create<ProductSlice>()((...a) => ({
  ...createProductSlice(...a),
  //...createFishSlice(...a),
}));
