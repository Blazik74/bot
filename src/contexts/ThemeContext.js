import React, { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

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
    hint: '#818c99'
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
    hint: '#98989e'
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.classList.add('theme-transition');
    document.documentElement.style.backgroundColor = themes[theme].background;
    document.body.style.backgroundColor = themes[theme].background;
    
    // Удаляем класс анимации после завершения перехода
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
    
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext); 
