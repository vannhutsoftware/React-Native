import { createContext } from 'react';

export type UserType = {
  name: string;
  email: string;
  avatar: any;
} | null;

export type UserContextType = {
  user: UserType;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);
