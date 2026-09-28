export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
}

export const books: Book[] = [
  {
    id: 'book-01',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Văn học',
    price: 72000,
  },
  {
    id: 'book-02',
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    category: 'Tiểu thuyết',
    price: 89000,
  },
  {
    id: 'book-03',
    title: 'Tư Duy Nhanh Và Chậm',
    author: 'Daniel Kahneman',
    category: 'Kỹ năng',
    price: 156000,
  },
];

export const findBook = (bookId: string) =>
  books.find((book) => book.id === bookId);
