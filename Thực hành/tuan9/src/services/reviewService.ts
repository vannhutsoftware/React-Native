import { api } from '../api/client';
import type { Review } from '../types';

export const reviewService = {
  async getByBook(bookId: number) {
    return (await api.get<Review[]>('/reviews', {
      params: { bookId, _sort: 'createdAt', _order: 'desc' },
    })).data;
  },
  async create(input: Omit<Review, 'id' | 'createdAt'>) {
    return (await api.post<Review>('/reviews', { ...input, createdAt: new Date().toISOString() })).data;
  },
  async remove(id: number) {
    await api.delete(`/reviews/${id}`);
  },
};
