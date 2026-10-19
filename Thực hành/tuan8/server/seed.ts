import type { Book, Review } from '../src/types/book';

export const sampleBooks: Book[] = [
  {
    id: '1', title: 'Lập trình React Native', author: 'Nhóm biên soạn', category: 'Lập trình', price: 120000,
    description: 'Thực hành xây dựng ứng dụng di động: giao diện, điều hướng, quản lý trạng thái và gọi API.',
  },
  {
    id: '2', title: 'TypeScript cơ bản', author: 'Nhóm biên soạn', category: 'Lập trình', price: 95000,
    description: 'Làm quen với kiểu dữ liệu, interface và cách viết chương trình bằng TypeScript.',
  },
  {
    id: '3', title: 'JavaScript thực hành', author: 'Nhóm biên soạn', category: 'Lập trình', price: 100000,
    description: 'Các bài thực hành về hàm, mảng, đối tượng và xử lý bất đồng bộ trong JavaScript.',
  },
];

export const sampleReviews: Review[] = [
  { id: 'sample-1', bookId: '1', userId: 'sample-user-1', userName: 'Minh Anh', rating: 4, comment: 'Nội dung dễ hiểu, có nhiều ví dụ thực hành.' },
  { id: 'sample-2', bookId: '1', userId: 'sample-user-2', userName: 'Hoàng Nam', rating: 5, comment: 'Phù hợp để bắt đầu học React Native.' },
];
