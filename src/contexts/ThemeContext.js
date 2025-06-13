import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#005EFF',
    border: '#E5E5E5',
    card: '#F5F5F5',
    button: '#005EFF',
    buttonText: '#fff',
    buttonSecondary: '#E0E0E0',
    buttonSecondaryText: '#005EFF',
  },
  dark: {
    background: '#1A1A1A',
    text: '#FFFFFF',
    primary: '#005EFF',
    border: '#333333',
    card: '#2A2A2A',
    button: '#005EFF',
    buttonText: '#fff',
    buttonSecondary: '#23272A',
    buttonSecondaryText: '#fff',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.style.transition = 'background 0.3s';
    document.body.style.background = isDarkMode ? themes.dark.background : themes.light.background;
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  const theme = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
