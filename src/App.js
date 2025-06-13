import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './AppRoutes';
import BottomNavigation from './components/BottomNavigation';
import styled from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding-bottom: 60px; // Space for bottom navigation
`;

const App = () => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.enableFullscreen();
    }
  }, []);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <AppContainer>
            <AppRoutes />
            <BottomNavigation />
          </AppContainer>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App; 
