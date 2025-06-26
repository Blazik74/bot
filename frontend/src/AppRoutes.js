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
import AdminPanel from './pages/AdminPanel'; // если такой страницы нет, создайте заглушку

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
  const { user, loading, canAccessApp } = useUser();
  const token = localStorage.getItem('authToken');

  if (loading && token) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );
  }

  // Доступ к админ-панели только для админов и суперадминов
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  // Если доступ есть, показываем все страницы
  return (
    <Routes>
      <Route path="/" element={<AICenter />} />
      <Route path="/targetolog" element={<Targetolog />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tariffs" element={<Tariffs />} />
      <Route path="/facebook-connect" element={<FacebookConnect />} />
      <Route path="/facebook-callback" element={<FacebookCallback />} />
      {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 
