import React, { useEffect, useState } from 'react';
import { HashRouter as Router, useLocation, useNavigate, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { BottomNavigation } from './components/BottomNavigation';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider, useThemeContext, themes } from './contexts/ThemeContext';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import { Notifications } from './components/Notifications.js';
import { useUser } from './contexts/UserContext';

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

const Loader = ({ theme }) => (
  <LoaderWrapper theme={theme}>
    <div className="loader-animation" style={{width:60,height:60}}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="24" stroke={theme.primary} strokeWidth="6" fill="none" strokeDasharray="120" strokeDashoffset="60">
          <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
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
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeContext();
  const { user, loading: userLoading } = useUser();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    if (!userLoading && theme) {
      setSplash(false);
    }
  }, [userLoading, theme]);

  // Определяем, на каких страницах показывать нижнюю панель
  const showBottomNav = ['/', '/targetolog', '/profile', '/tariffs'].includes(location.pathname);

  if (splash) {
    return <Loader theme={themes[theme] || themes.light} />;
  }

  return (
    <AppContainer>
      <Notifications />
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
      {showBottomNav && <BottomNavigation activeTab={location.pathname} />}
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
