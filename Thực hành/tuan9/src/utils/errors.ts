import { isAxiosError } from 'axios';

const messages: Record<string, string> = {
  'Cannot find user': 'Email hoặc mật khẩu không đúng.',
  'Incorrect password': 'Email hoặc mật khẩu không đúng.',
  'Email already exists': 'Email đã được sử dụng.',
  'Email format is invalid': 'Email không đúng định dạng.',
  'Password is too short': 'Mật khẩu quá ngắn.',
  'Email and password are required': 'Vui lòng nhập email và mật khẩu.',
};

export function statusOf(error: unknown) {
  return isAxiosError(error) ? error.response?.status : undefined;
}

export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Không kết nối được máy chủ. Kiểm tra server và địa chỉ IP.';
    if (error.response.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    if (error.response.status === 403) return 'Bạn không có quyền thực hiện thao tác này.';
    if (error.response.status === 404) return 'Không tìm thấy dữ liệu.';
    const data = error.response.data;
    if (typeof data === 'string' && messages[data]) return messages[data];
    return 'Không thể thực hiện thao tác. Vui lòng thử lại.';
  }
  return error instanceof Error ? error.message : 'Đã xảy ra lỗi. Vui lòng thử lại.';
}
