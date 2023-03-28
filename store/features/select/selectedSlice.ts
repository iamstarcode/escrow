import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductResponseSuccess } from "../../../lib/supabase";
import { RootState } from "../../store";

type SelectedState = {
  isSelected?: boolean;
  //images?: any;
} & ProductResponseSuccess;

const initialState: SelectedState[] = [
  {
    isSelected: false,
    can_edit: false,
    description: "",
    id: 0,
    images: [],
    name: "",
    price: "",
    user_id: "",
  },
];

export const selectSlice = createSlice({
  name: "select",
  initialState: initialState,
  reducers: {
    setSelected: (state, action: PayloadAction<SelectedState[]>) => {
      state.splice(0, state.length);
      action.payload?.map((item: SelectedState) => state.push(item));
    },
    setSelectedProduct: {
      reducer(
        state,
        action: PayloadAction<SelectedState, string, { index: number }>
      ) {
        state[action.meta.index] = action.payload;
      },
      prepare(payload: SelectedState, index: number) {
        return { payload, meta: { index } };
      },
    },
  },
});

export const { setSelected, setSelectedProduct } = selectSlice.actions;
export function selectSelected(state: RootState) {
  return state.select;
}
export const selectProduct = (state: RootState, index: number) =>
  state.select[index];

export default selectSlice.reducer;
