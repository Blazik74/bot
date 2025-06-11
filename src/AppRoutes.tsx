import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AiCenterPage from './pages/AiCenterPage';
import TargetologPage from './pages/TargetologPage';
import ProfilePage from './pages/ProfilePage';
import TariffsPage from './pages/TariffsPage';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page-content">{children}</div>
);

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><AiCenterPage /></PageWrapper>} />
        <Route path="/targetolog" element={<PageWrapper><TargetologPage /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
        <Route path="/tariffs" element={<PageWrapper><TariffsPage /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
