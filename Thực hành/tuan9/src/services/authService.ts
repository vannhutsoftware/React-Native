import { api } from '../api/client';
import type { Session, User } from '../types';
import { getJwtExpiry, toPublicUser } from '../utils/auth';

interface AuthResponse { accessToken: string; user: User }
function toSession(data: AuthResponse): Session {
  const expiresAt = getJwtExpiry(data.accessToken);
  if (expiresAt <= Date.now()) throw new Error('Token không hợp lệ hoặc đã hết hạn.');
  return { token: data.accessToken, user: toPublicUser(data.user), expiresAt };
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/login', { email: email.trim().toLowerCase(), password });
    return toSession(data);
  },
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<AuthResponse>('/register', {
      name: name.trim(), email: email.trim().toLowerCase(), password,
    });
    return toSession(data);
  },
  async getMe(id: number) {
    const { data } = await api.get<User>(`/users/${id}`);
    return toPublicUser(data);
  },
};
