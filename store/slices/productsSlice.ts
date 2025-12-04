import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  thumbnail: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
  };
}

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  searchQuery: string;
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  total: 0,
  page: 1,
  pageSize: 20,
  hasMore: true,
  isLoading: false,
  searchQuery: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<{
      products: Product[];
      total: number;
      page: number;
      hasMore: boolean;
    }>) => {
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setProducts, setFeaturedProducts, setLoading, setSearchQuery, setPage } = productsSlice.actions;
export default productsSlice.reducer;
