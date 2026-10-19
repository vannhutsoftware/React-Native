import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthSession } from '../types/auth';

const initialState: { token: string | null; user: AuthSession['user'] | null; initialized: boolean } = {
  token: null,
  user: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.initialized = true;
    },
    clearSession: (state) => {
      state.token = null;
      state.user = null;
      state.initialized = true;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
