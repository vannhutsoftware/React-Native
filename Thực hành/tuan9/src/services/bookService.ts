import { api } from '../api/client';
import type { Book } from '../types';

export const bookService = {
  async getPage(page: number, limit: number) {
    return (await api.get<Book[]>('/books', { params: { _page: page, _limit: limit } })).data;
  },
  async getById(id: number) {
    return (await api.get<Book>(`/books/${id}`)).data;
  },
  async getRelated(book: Book) {
    return (await api.get<Book[]>('/books', {
      params: { category: book.category, id_ne: book.id, _limit: 10 },
    })).data;
  },
};
