import React, { createContext, useState, useContext } from 'react';

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
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext); 
