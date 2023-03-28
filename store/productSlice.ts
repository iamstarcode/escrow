import { create, StateCreator } from "zustand";
import { ProductResponseSuccess } from "../lib/supabase";

type SelectedState = {
  isSelected?: boolean;
  //images?: any;
} & ProductResponseSuccess;

export interface ProductSlice {
  products: SelectedState[];
  selected: SelectedState[];
  setProducts: (product: SelectedState[] | undefined) => void;
  updateAProduct: (index: number, product: SelectedState) => void;
}
/* export const useSelectedStore = (set, get) => ({
  products: [],
  selected: [],
  setProducts: (products) => set((state) => ({ products: products })),
  updateAProduct: (index, product) =>
    set((state) => ({
      setProducts: () => state.products,
    })),
}); */

interface BearSlice {
  bears?: number;
  addBear: () => void;
  //eatFish: () => void
}

interface OtherSlice {
  bears?: number;
  addBear?: () => void;
  //eatFish: () => void
}
export const createProductSlice: StateCreator<
  ProductSlice,
  [],
  [],
  ProductSlice
> = (set) => ({
  products: [],
  selected: [],
  setProducts: (products) => set(() => ({ products: products })),
  updateAProduct: (index, product) =>
    set((state) => ({
      setProducts: () => state.products,
    })),
});
