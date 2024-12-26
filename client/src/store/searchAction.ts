import { createSlice } from '@reduxjs/toolkit';

const initialState = { products: [] };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchProduct(state, action) {
      state.products = action.payload;
    },
  },
});

export const searchAction = searchSlice.actions;
export default searchSlice.reducer;
