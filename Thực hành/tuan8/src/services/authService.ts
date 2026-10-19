import { api } from './api';
import type { AuthSession, Credentials, User } from '../types/auth';

export const authService = {
  async login(credentials: Credentials): Promise<AuthSession> {
    const { data } = await api.post<AuthSession>('/login', credentials);
    return data;
  },
  async register(credentials: Credentials): Promise<User> {
    const { data } = await api.post<User>('/register', credentials);
    return data;
  },
  async getUser(token: string): Promise<User> {
    const { data } = await api.get<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  async logout(token: string): Promise<void> {
    await api.post('/logout', null, { headers: { Authorization: `Bearer ${token}` } });
  },
};
