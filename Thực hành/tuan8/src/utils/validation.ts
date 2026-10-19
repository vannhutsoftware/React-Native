import type { Credentials } from '../types/auth';

export function validateCredentials({ email, password }: Credentials) {
  return {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? ''
      : 'Email không đúng định dạng.',
    password: password.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự.',
  };
}
