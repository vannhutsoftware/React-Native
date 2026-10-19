import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';
import type { AuthSession } from '../types/auth';
import { authService } from './authService';

export async function restoreAuth(): Promise<AuthSession | null> {
  const saved = await AsyncStorage.getItem('auth');
  if (!saved) return null;

  let token: unknown;
  try {
    token = JSON.parse(saved)?.token;
  } catch {
    token = null;
  }
  if (typeof token !== 'string' || !token.trim()) {
    await AsyncStorage.removeItem('auth');
    return null;
  }

  try {
    const user = await authService.getUser(token);
    const session = { token, user };
    await AsyncStorage.setItem('auth', JSON.stringify(session));
    return session;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      await AsyncStorage.removeItem('auth');
      return null;
    }
    // Lỗi mạng không đồng nghĩa token hết hạn; giữ phiên để có thể thử lại.
    throw error;
  }
}
