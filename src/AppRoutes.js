import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AICenter from './pages/AICenter';
import Targetolog from './pages/Targetolog';
import Tariffs from './pages/Tariffs';
import Profile from './pages/Profile';
import { Notifications } from './components/Notifications';
import FacebookConnect from './pages/FacebookConnect';

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<AICenter />} />  */}
      {/* <Route path="/targetolog" element={<Targetolog />} /> */}
      {/* <Route path="/profile" element={<Profile />} /> */}
      {/* <Route path="/tariffs" element={<Tariffs />} /> */}
      <Route path="/facebook-connect" element={<FacebookConnect />} />
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default AppRoutes; 
