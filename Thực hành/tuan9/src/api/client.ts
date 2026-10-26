import { create } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const host = Platform.OS === 'web' ? 'localhost'
  : (expoHost ?? (Platform.OS === 'android' ? '10.0.2.2' : 'localhost'));
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${host}:3000`;
export const api = create({ baseURL: BASE_URL, timeout: 10000 });

export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}
