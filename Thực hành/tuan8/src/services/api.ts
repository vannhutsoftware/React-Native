import { create } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Điện thoại dùng cùng địa chỉ máy tính đang chạy Expo; web dùng localhost.
const host = Constants.expoConfig?.hostUri?.split(':')[0];
const defaultHost = Platform.OS === 'web' ? 'localhost' : (host ?? '10.0.2.2');

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || `http://${defaultHost}:3001`,
  timeout: 10000,
});
