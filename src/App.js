import React, { useEffect, useState } from 'react';
import { HashRouter as Router, useLocation, useNavigate, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { BottomNavigation } from './components/BottomNavigation';
import styled, { ThemeProvider } from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import { themes } from './contexts/ThemeContext';
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
  background-color: #fff;
  color: #181A1B;
  display: flex;
  flex-direction: column;
`;

const LoaderWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #181A1B;
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
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
    document.body.style.background = '#fff';
    document.documentElement.style.background = '#fff';
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.ready) {
      window.Telegram.WebApp.ready();
      setTimeout(() => {
        window.Telegram.WebApp.postEvent('web_app_request_fullscreen');
      }, 100);
    }
    // Предзагрузка всех иконок и изображений
    Promise.all(allImages.map(src => new Promise(resolve => {
      const img = new window.Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve;
    }))).then(() => {
      setTimeout(() => setLoading(false), 400);
    });
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

const App = () => (
  <ThemeProvider theme={themes['light']}>
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
