import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AICenter } from './pages/AICenter';
import { Targetolog } from './pages/Targetolog';
import { Tariffs } from './pages/Tariffs';
import { Profile } from './pages/Profile';
import { BottomNavigation } from './components/BottomNavigation';
import { Notifications } from './components/Notifications';

export const AppRoutes = () => {
  return (
    <>
      <Notifications />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate to="/ai-center" replace />} />
          <Route path="/ai-center" element={<AICenter />} />
          <Route path="/targetolog" element={<Targetolog />} />
          <Route path="/tariffs" element={<Tariffs />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
      <BottomNavigation />
    </>
  );
};
