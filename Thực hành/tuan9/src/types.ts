export interface User { id: number; name: string; email: string }
export interface Session { token: string; user: User; expiresAt: number }
export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
  description: string;
}
export interface Review {
  id: number;
  bookId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
