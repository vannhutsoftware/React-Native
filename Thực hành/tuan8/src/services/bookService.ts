import { api } from './api';
import type { Book, Review, ReviewInput } from '../types/book';

export const bookService = {
  async getAll(): Promise<Book[]> {
    const { data } = await api.get<Book[]>('/books');
    return data;
  },
  async getById(id: string): Promise<Book> {
    const { data } = await api.get<Book>(`/books/${encodeURIComponent(id)}`);
    return data;
  },
  async getRelated(book: Book): Promise<Book[]> {
    const { data } = await api.get<Book[]>('/books', {
      params: { category: book.category, id_ne: book.id },
    });
    return data;
  },
};

export const reviewService = {
  async getByBook(bookId: string): Promise<Review[]> {
    const { data } = await api.get<Review[]>('/reviews', { params: { bookId } });
    return data;
  },
  async create(review: ReviewInput, token: string): Promise<Review> {
    const { data } = await api.post<Review>('/reviews', review, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
