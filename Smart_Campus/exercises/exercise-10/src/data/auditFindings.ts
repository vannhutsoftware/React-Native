export type AuditFinding = {
  id: string;
  title: string;
  before: string;
  after: string;
};

export const AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: 'name',
    title: 'Tên truy cập',
    before: 'Nút thông báo không có tên để trình đọc màn hình công bố.',
    after: 'Thêm accessibilityLabel “Mở thông báo”.',
  },
  {
    id: 'role',
    title: 'Vai trò',
    before: 'Thẻ học phần tương tác nhưng được công bố như văn bản.',
    after: 'Khai báo accessibilityRole="button" và accessibilityHint.',
  },
  {
    id: 'state',
    title: 'Trạng thái',
    before: 'Bộ lọc “Đang học” không công bố trạng thái đã chọn.',
    after: 'Thêm accessibilityState={{ selected: true }}.',
  },
  {
    id: 'order',
    title: 'Thứ tự đọc',
    before: 'Số phòng được đọc trước tên học phần nên thiếu ngữ cảnh.',
    after: 'Sắp xếp tên học phần, giảng viên, phòng rồi đến hành động.',
  },
  {
    id: 'target',
    title: 'Vùng chạm',
    before: 'Nút biểu tượng chỉ có kích thước 32 × 32 dp.',
    after: 'Tăng vùng chạm tối thiểu lên 48 × 48 dp và thêm hitSlop.',
  },
  {
    id: 'contrast',
    title: 'Tương phản',
    before: 'Chữ phụ màu xám nhạt khó đọc trên nền trắng.',
    after: 'Đổi sang màu chữ #475467 đậm hơn.',
  },
  {
    id: 'large-text',
    title: 'Chữ lớn bị cắt',
    before: 'Tiêu đề bị giới hạn một dòng và dùng chiều cao cố định.',
    after: 'Bỏ numberOfLines, dùng minHeight và cho phép xuống dòng.',
  },
];
