import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import counterReducer from "./features/counter/counterSlice";
import selectSlice from "./features/select/selectedSlice";

import { create } from "zustand";
import { ProductSlice, createProductSlice } from "./productSlice";

export const useBoundStore = create<ProductSlice>()((...a) => ({
  ...createProductSlice(...a),
}));
