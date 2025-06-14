import React from 'react';
import Notifications from './components/Notifications';
import AICenter from './pages/AICenter';
import { Targetolog } from './pages/Targetolog';
import Tariffs from './pages/Tariffs';
import Profile from './pages/Profile';
import FacebookConnect from './pages/FacebookConnect';

const AppRoutes = () => {
  // Вставляй по одному компоненту внутрь return для проверки:
  // + return <Notifications />;
  // return <AICenter />;
  return <Targetolog />;
  // return <Tariffs />;
  // return <Profile />;
  // return <FacebookConnect />;
  return null; // Меняй на нужный компонент
};

export default AppRoutes;
