import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../types';

interface CartItem { book: Book; quantity: number }
const cartSlice = createSlice({
  name: 'cart', initialState: [] as CartItem[],
  reducers: {
    addToCart(state, { payload }: PayloadAction<Book>) {
      const item = state.find((entry) => entry.book.id === payload.id);
      if (item) item.quantity += 1;
      else state.push({ book: payload, quantity: 1 });
    },
    removeFromCart(state, { payload }: PayloadAction<number>) {
      return state.filter((item) => item.book.id !== payload);
    },
    clearCart() { return []; },
  },
});
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
