import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AICenter from './pages/AICenter';
import Targetolog from './pages/Targetolog';
import Tariffs from './pages/Tariffs';
import Profile from './pages/Profile';
import { Notifications } from './components/Notifications';
import FacebookConnect from './pages/FacebookConnect';

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

const AnimatedRoute = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: 'easeInOut' }}
    style={{ minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();
  return (
    <>
      <Notifications />
      <Routes>
        <Route path="/" element={<AnimatedRoute><AICenter /></AnimatedRoute>} />
        <Route path="/targetolog" element={<AnimatedRoute><Targetolog /></AnimatedRoute>} />
        <Route path="/profile" element={<AnimatedRoute><Profile /></AnimatedRoute>} />
        <Route path="/tariffs" element={<AnimatedRoute><Tariffs /></AnimatedRoute>} />
        <Route path="/facebook-connect" element={<AnimatedRoute><FacebookConnect /></AnimatedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes; 
