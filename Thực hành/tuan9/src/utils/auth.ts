import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';

export function getJwtExpiry(token: string): number {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    return typeof exp === 'number' && Number.isFinite(exp) && exp > 0 ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

// Chỉ lấy 3 trường công khai, không lưu password từ GET /users/:id.
export function toPublicUser(user: User): User {
  return { id: user.id, name: user.name || user.email.split('@')[0], email: user.email };
}

export function validateCredentials(email: string, password: string) {
  return {
    email: !email.trim() ? 'Vui lòng nhập email.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'Email không đúng định dạng.' : '',
    password: !password ? 'Vui lòng nhập mật khẩu.'
      : password.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự.' : '',
  };
}
