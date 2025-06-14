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
  display: flex;
  flex-direction: column;
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
      return <h1>Произошла ошибка в приложении</h1>;
    }
    return this.props.children;
  }
}

const Loader = ({ theme }) => (
  <LoaderWrapper theme={theme}>
    Загрузка…
  </LoaderWrapper>
);

// Функция для предзагрузки всех SVG и изображений
const preloadImages = (imageList) => {
  return Promise.all(imageList.map(src => {
    return new Promise(resolve => {
      const img = new window.Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = resolve;
    });
  }));
};

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
  // Добавь сюда другие изображения, если появятся
];

const AppContent = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Синхронизация body и html с темой
    document.body.style.background = theme === 'dark' ? '#181A1B' : '#fff';
    document.documentElement.style.background = theme === 'dark' ? '#181A1B' : '#fff';
    // Telegram Mini App Full Screen Mode (через web_app_request_fullscreen)
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.postEvent) {
      window.Telegram.WebApp.ready();
      setTimeout(() => {
        window.Telegram.WebApp.postEvent('web_app_request_fullscreen');
      }, 100);
    }
    // Предзагрузка всех иконок и изображений
    preloadImages(allImages).then(() => {
      setTimeout(() => setLoading(false), 400); // Короткая задержка для плавности
    });
  }, [theme]);

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
