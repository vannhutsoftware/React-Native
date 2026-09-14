/**
 * Danh sách endpoint API và định nghĩa kiểu dữ liệu mẫu cho Thực hành Tuần 4
 * Chủ đề: GỌI API & XỬ LÝ BẤT ĐỒNG BỘ — TypeScript trong React Native
 */

export const API_ENDPOINTS = {
  // JSONPlaceholder
  POSTS: 'https://jsonplaceholder.typicode.com/posts',
  USER_DETAIL: (id: number = 1) => `https://jsonplaceholder.typicode.com/users/${id}`,
  USERS: 'https://jsonplaceholder.typicode.com/users',
  INVALID_URL: 'https://jsonplaceholder.typicode.com/invalid_endpoint_error_test_404',

  // DummyJSON
  PRODUCTS_SEARCH: (keyword: string, limit: number = 10) =>
    `https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
  PRODUCTS_PAGINATION: (skip: number = 0, limit: number = 10) =>
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
};

// Kiểu dữ liệu Bài 9: Tin tức (Post)
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Kiểu dữ liệu Bài 10: Người dùng (User)
export interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

export interface UserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address?: UserAddress;
  company?: UserCompany;
}

// Kiểu dữ liệu Bài 11, 14: Sản phẩm (Product)
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

// Kiểu dữ liệu Generic Interface cho ApiResponse
export interface ApiResponse<T> {
  products?: T[];
  data?: T[];
  total: number;
  skip?: number;
  limit?: number;
  page?: number;
}

// Kiểu lỗi tùy biến cho Bài 12
export interface CustomError {
  name: string;
  message: string;
  status?: number;
}
