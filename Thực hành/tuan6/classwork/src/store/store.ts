import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

interface CartItem {
  bookId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialCartState: CartState = {
  items: [{ bookId: 'book-01', quantity: 1 }],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find((row) => row.bookId === action.payload);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ bookId: action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((row) => row.bookId === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((row) => row.bookId === action.payload);
      if (item) item.quantity = Math.max(1, item.quantity - 1);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((row) => row.bookId !== action.payload);
    },
  },
});

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isLoggedIn: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginDemo: (state) => {
      state.user = {
        id: 'user-01',
        name: 'Nguyễn Văn An',
        email: 'an@example.com',
      };
      state.token = 'demo-token-week-5';
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

interface WishlistState {
  bookIds: string[];
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { bookIds: ['book-02'] } as WishlistState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<string>) => {
      if (state.bookIds.includes(action.payload)) {
        state.bookIds = state.bookIds.filter((id) => id !== action.payload);
      } else {
        state.bookIds.push(action.payload);
      }
    },
  },
});

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    auth: authSlice.reducer,
    wishlist: wishlistSlice.reducer,
  },
});

export const cartActions = cartSlice.actions;
export const authActions = authSlice.actions;
export const wishlistActions = wishlistSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
