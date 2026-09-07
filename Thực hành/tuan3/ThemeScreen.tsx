import React, { createContext, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function HomeScreen() {
  const context = useContext(ThemeContext);
  const isDarkMode = context?.isDarkMode ?? false;
  const toggleTheme = context?.toggleTheme ?? (() => {});

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#222222' : '#ffffff' },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#222222' }]}>
        {isDarkMode ? 'Chế độ tối (Dark Mode)' : 'Chế độ sáng (Light Mode)'}
      </Text>

      <Button title="Đổi giao diện" onPress={toggleTheme} />
    </View>
  );
}

export default function ThemeScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(previousMode => !previousMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <HomeScreen />
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
