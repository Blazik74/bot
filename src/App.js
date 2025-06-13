import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import AppRoutes from './AppRoutes';
import BottomNav from './components/BottomNav';
import styled from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding-bottom: 60px; // Space for bottom navigation
`;

const AppContent = () => {
  const { theme } = useTheme();
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.enableFullscreen();
    }
  }, []);

  return (
    <StyledThemeProvider theme={theme}>
      <AppContainer>
        <AppRoutes />
        <BottomNav />
      </AppContainer>
    </StyledThemeProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  </ThemeProvider>
);

export default App; 
