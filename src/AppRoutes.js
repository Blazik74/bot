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
  return <div style={{padding: 40, color: 'green'}}>Test Render</div>;
};

export default AppRoutes; 
