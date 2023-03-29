import { create, StateCreator } from "zustand";
import { ProductResponseSuccess } from "../lib/supabase";

export type SelectedState = {
  isSelected?: boolean;
} & ProductResponseSuccess;

export interface ProductSlice {
  products: SelectedState[];
  selected: SelectedState[];
  setProducts: (product: SelectedState[] | undefined) => void;
  toggleSelected: (index: string | undefined) => void;
  updateAProduct: (product: SelectedState) => void;
}

export const createProductSlice: StateCreator<
  ProductSlice,
  [],
  [],
  ProductSlice
> = (set, get) => ({
  products: [],
  selected: [],
  setProducts: (products) => set({ products }),
  toggleSelected: (id: any) => {
    const products = get().products.map((item: SelectedState) =>
      item.id === id ? { ...item, isSelected: !item.isSelected } : item
    );
    const selected = products.filter((item: SelectedState) => item.isSelected);
    set({ products, selected });
  },
  updateAProduct: (product) => {
    const selected = get().selected.map((item: SelectedState) =>
      item.id === product.id ? { ...product } : item
    );
    const products = get().products.map((item: SelectedState) =>
      item.id === product.id ? { ...product } : item
    );
    set({ selected, products });
  },
});
