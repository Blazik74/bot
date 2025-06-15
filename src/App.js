import React, { useEffect, useState } from 'react';
import { HashRouter as Router, useLocation, useNavigate, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import BottomNavigation from './components/BottomNavigation';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import './App.css';

// Импорт SVG-иконок
import aiCenter from './assets/icons/ai-center.svg';
import aiCenterActive from './assets/icons/ai-center-active.svg';
import targetolog from './assets/icons/targetolog.svg';
import targetologActive from './assets/icons/targetolog-active.svg';
import profile from './assets/icons/profile.svg';
import profileActive from './assets/icons/profile-active.svg';
import buhgalter from './assets/icons/buhgalter.svg';
import seller from './assets/icons/seller.svg';
import consultant from './assets/icons/consultant.svg';
import fileUpload from './assets/icons/file-upload.svg';
import home from './assets/icons/home.svg';
import homeActive from './assets/icons/home-active.svg';
import target from './assets/icons/target.svg';
import targetActive from './assets/icons/target-active.svg';
import facebook from './assets/icons/facebook.svg';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const LoaderWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  font-weight: 700;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Можно отправить лог на сервер
    console.error('ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color:'red',padding:32}}><h1>Произошла ошибка в приложении</h1><pre>{String(this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}

const Loader = () => (
  <LoaderWrapper>
    Загрузка…
  </LoaderWrapper>
);

const allImages = [
  aiCenter,
  aiCenterActive,
  targetolog,
  targetologActive,
  profile,
  profileActive,
  buhgalter,
  seller,
  consultant,
  fileUpload,
  home,
  homeActive,
  target,
  targetActive,
  facebook,
];

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = '#fff';
    document.documentElement.style.background = '#fff';
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.ready) {
      window.Telegram.WebApp.ready();
      setTimeout(() => {
        window.Telegram.WebApp.postEvent('web_app_request_fullscreen');
      }, 100);
    }
    setLoading(false);
  }, []);

  console.log('AppContent render', { loading });

  if (loading) return <Loader />;

  return (
    <AppContainer>
      <AppRoutes />
      <BottomNavigation />
    </AppContainer>
  );
};

const ThemedApp = () => {
  const { theme } = useThemeContext();
  return (
    <StyledThemeProvider theme={themes[theme]}>
      <NotificationProvider>
        <ErrorBoundary>
          <Router>
            <AppContainer theme={themes[theme]} className="theme-transition">
              <AppContent />
            </AppContainer>
          </Router>
        </ErrorBoundary>
      </NotificationProvider>
    </StyledThemeProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <ThemedApp />
  </ThemeProvider>
);

export default App; 
