import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomNavBar } from './components/BottomNavBar';
import AiCenterPage from './pages/AiCenterPage';
import TargetologPage from './pages/TargetologPage';
import ProfilePage from './pages/ProfilePage';
import TariffsPage from './pages/TariffsPage';
import './App.css';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    className="page-content"
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -40 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
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

function App() {
  return (
    <div className="app-container">
      <Router>
        <AppRoutes />
        <BottomNavBar />
      </Router>
    </div>
  );
}

export default App;
