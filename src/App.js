import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import AppRoutes from './AppRoutes';
import { BottomNavigation } from './components/BottomNavigation';
import styled from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding-bottom: 60px; // Space for bottom navigation
`;

const LoaderWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  font-size: 24px;
  font-weight: 700;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Можно отправить лог на сервер
  }
  render() {
    if (this.state.hasError) {
      // Перезагружаем мини-апп полностью
      if (window.Telegram?.WebApp?.close) {
        window.Telegram.WebApp.close();
      } else {
        window.location.reload();
      }
      return null;
    }
    return this.props.children;
  }
}

const Loader = ({ theme }) => (
  <LoaderWrapper theme={theme}>
    Загрузка…
  </LoaderWrapper>
);

const AppContent = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    // Имитация загрузки данных/иконок/темы
    setTimeout(() => setLoading(false), 900);
  }, []);

  if (loading) return <Loader theme={theme} />;

  return (
    <StyledThemeProvider theme={theme}>
      <AppContainer>
        <AppRoutes />
        <BottomNavigation />
      </AppContainer>
    </StyledThemeProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <NotificationProvider>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </NotificationProvider>
  </ThemeProvider>
);

export default App; 
