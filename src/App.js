import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { BottomNavigation } from './components/BottomNavigation';
import styled from 'styled-components';
import { NotificationProvider } from './contexts/NotificationContext';
import './App.css';

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
      return <h1>Произошла ошибка в приложении</h1>;
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
  require('./assets/icons/ai-center.svg'),
  require('./assets/icons/ai-center-active.svg'),
  require('./assets/icons/targetolog.svg'),
  require('./assets/icons/targetolog-active.svg'),
  require('./assets/icons/profile.svg'),
  require('./assets/icons/profile-active.svg'),
  require('./assets/icons/buhgalter.svg'),
  require('./assets/icons/seller.svg'),
  require('./assets/icons/consultant.svg'),
  require('./assets/icons/file-upload.svg'),
  require('./assets/icons/home.svg'),
  require('./assets/icons/home-active.svg'),
  require('./assets/icons/target.svg'),
  require('./assets/icons/target-active.svg'),
  require('./assets/icons/facebook.svg'),
  // profile-icon.svg убран, так как он пустой
];

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.body.style.background = '#fff';
    document.documentElement.style.background = '#fff';
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.postEvent) {
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

  if (loading) return <Loader />;

  return (
    <AppContainer>
      <AppRoutes />
      <BottomNavigation />
    </AppContainer>
  );
};

const App = () => (
  <NotificationProvider>
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  </NotificationProvider>
);

export default App; 
