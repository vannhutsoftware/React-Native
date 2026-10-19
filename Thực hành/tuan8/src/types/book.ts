export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

export interface ReviewInput {
  bookId: string;
  rating: number;
  comment: string;
}
