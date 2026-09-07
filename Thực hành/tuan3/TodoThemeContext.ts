import { createContext } from 'react';

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const TodoThemeContext = createContext<ThemeContextType | null>(null);
