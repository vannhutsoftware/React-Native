import type { Session, User } from '../types';
import { getJwtExpiry, toPublicUser } from '../utils/auth';
import { statusOf } from '../utils/errors';

export const AUTH_STORAGE_KEY = 'auth';
interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
  removeItem(key: string): Promise<unknown>;
}

export async function saveStoredSession(storage: Storage, session: Session) {
  const safe = { token: session.token, user: toPublicUser(session.user), expiresAt: getJwtExpiry(session.token) };
  await storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safe));
  return safe;
}

export async function restoreStoredSession(storage: Storage, getMe: (id: number) => Promise<User>,
  setToken: (token: string | null) => void): Promise<Session | null> {
  setToken(null);
  const raw = await storage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  let saved: Session;
  try {
    saved = JSON.parse(raw);
    if (typeof saved?.token !== 'string' || !Number.isInteger(saved.user?.id) || saved.user.id <= 0
      || typeof saved.user?.email !== 'string' || getJwtExpiry(saved.token) <= Date.now()) {
      throw new Error('Invalid session');
    }
  } catch {
    await storage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
  setToken(saved.token);
  try {
    const user = await getMe(saved.user.id);
    return await saveStoredSession(storage, { token: saved.token, user, expiresAt: getJwtExpiry(saved.token) });
  } catch (error) {
    setToken(null);
    if ([401, 403, 404].includes(statusOf(error) ?? 0)) {
      await storage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    // Giữ bản lưu để thử lại khi có mạng, chưa xác nhận đăng nhập.
    throw error;
  }
}
