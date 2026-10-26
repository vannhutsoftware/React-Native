import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { setAuthToken } from '../api/client';
import { authService } from '../services/authService';
import { AUTH_STORAGE_KEY, restoreStoredSession, saveStoredSession } from '../services/sessionService';
import type { Session } from '../types';
import { errorMessage } from '../utils/errors';

export const saveSession = createAsyncThunk('auth/save', async (session: Session) => {
  const safe = await saveStoredSession(AsyncStorage, session);
  setAuthToken(safe.token);
  return safe;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  setAuthToken(null);
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
});

export const restoreSession = createAsyncThunk('auth/restore', () =>
  restoreStoredSession(AsyncStorage, authService.getMe, setAuthToken));

interface AuthState { session: Session | null; restoring: boolean; restoreError: string }
const initialState: AuthState = { session: null, restoring: true, restoreError: '' };
const authSlice = createSlice({
  name: 'auth', initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(restoreSession.pending, (state) => {
      state.restoring = true;
      state.restoreError = '';
    }).addCase(restoreSession.fulfilled, (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.restoring = false;
    }).addCase(restoreSession.rejected, (state) => {
      state.session = null;
      state.restoring = false;
      state.restoreError = 'Chưa xác minh được phiên đăng nhập. Kiểm tra kết nối rồi thử lại.';
    }).addCase(saveSession.fulfilled, (state, action) => {
      state.session = action.payload;
      state.restoreError = '';
    }).addCase(logout.pending, (state) => {
      state.session = null;
      state.restoreError = '';
    }).addCase(logout.rejected, (state, action) => {
      state.restoreError = errorMessage(new Error(action.error.message || 'Không xoá được phiên đã lưu.'));
    });
  },
});
export default authSlice.reducer;
