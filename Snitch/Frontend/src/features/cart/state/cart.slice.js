import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isOpen: false,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(
        (i) => String(i._id) === String(itemId)
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      const targetId = action.payload?.itemId || action.payload;
      state.items = state.items.filter(
        (i) => String(i._id) !== String(targetId)
      );
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItemQuantity,
  removeItem,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;
export default cartSlice.reducer;

