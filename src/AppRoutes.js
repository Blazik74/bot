import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

// Импорт страниц
import AICenter from './pages/AICenter';
import Targetolog from './pages/Targetolog';
import Tariffs from './pages/Tariffs';
import Profile from './pages/Profile';
import FacebookConnect from './pages/FacebookConnect';
import FacebookCallback from './pages/FacebookCallback';
import AccessDeniedPage from './pages/AccessDeniedPage'; // Импортируем новую страницу
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s ease infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const AppRoutes = () => {
  const { user, loading, hasAccess, isAdmin } = useUser();
  const token = localStorage.getItem('authToken');

  if (loading && token) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );
  }

  // Определяем, есть ли у пользователя полный доступ
  const canAccessApp = hasAccess || isAdmin;

  // Если у пользователя нет токена или нет полного доступа, показываем страницу "Доступ запрещен"
  // Оставляем доступ к странице /facebook-callback, чтобы завершить авторизацию
  if (!user || !canAccessApp) {
    return (
        <Routes>
            <Route path="/facebook-callback" element={<FacebookCallback />} />
            <Route path="*" element={<AccessDeniedPage />} />
        </Routes>
    );
  }
  
  // Если доступ есть, показываем все страницы
  return (
    <Routes>
      <Route path="/" element={<AICenter />} />
      <Route path="/targetolog" element={<Targetolog />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tariffs" element={<Tariffs />} />
      <Route path="/facebook-connect" element={<FacebookConnect />} />
      <Route path="/facebook-callback" element={<FacebookCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 
