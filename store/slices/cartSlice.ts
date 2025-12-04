import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    thumbnail: string;
    slug: string;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<{ items: CartItem[]; total: number; itemCount: number }>) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.itemCount = action.payload.itemCount;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { setCart, setLoading, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
