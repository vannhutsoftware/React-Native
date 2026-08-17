export const SUMMARY_LIMIT = 160;

export type CopyMode = 'vague' | 'actionable';

export type FormValues = {
  fullName: string;
  studentId: string;
  email: string;
  summary: string;
};

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export function validateForm(values: FormValues, mode: CopyMode): FormErrors {
  const errors: FormErrors = {};
  const vagueMessage = 'Invalid input';

  if (values.fullName.trim().length === 0) {
    errors.fullName =
      mode === 'vague'
        ? vagueMessage
        : 'Họ và tên không được chỉ chứa khoảng trắng.';
  }

  if (!/^\d{8}$/.test(values.studentId)) {
    errors.studentId =
      mode === 'vague'
        ? vagueMessage
        : 'Mã sinh viên phải gồm đúng 8 chữ số, ví dụ 22110123.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email =
      mode === 'vague'
        ? vagueMessage
        : 'Nhập email đúng định dạng, ví dụ an.nguyen@st.hcmute.edu.vn.';
  }

  if (values.summary.length > SUMMARY_LIMIT) {
    const extraCharacters = values.summary.length - SUMMARY_LIMIT;
    errors.summary =
      mode === 'vague'
        ? vagueMessage
        : `Tóm tắt vượt quá ${SUMMARY_LIMIT} ký tự. Hãy xóa bớt ${extraCharacters} ký tự.`;
  }

  return errors;
}
