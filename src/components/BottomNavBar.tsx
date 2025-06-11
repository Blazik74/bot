import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as AiCenterActive } from '../assets/icons/ai-center-active.svg';
import { ReactComponent as AiCenterInactive } from '../assets/icons/ai-center-inactive.svg';
import { ReactComponent as TargetologActive } from '../assets/icons/targetolog-active.svg';
import { ReactComponent as TargetologInactive } from '../assets/icons/targetolog-inactive.svg';
import { ReactComponent as ProfileActive } from '../assets/icons/profile-active.svg';
import { ReactComponent as ProfileInactive } from '../assets/icons/profile-inactive.svg';
import './BottomNavBar.css';

const navItems = [
  {
    path: '/',
    label: 'ИИ центр',
    ActiveIcon: AiCenterActive,
    InactiveIcon: AiCenterInactive,
  },
  {
    path: '/targetolog',
    label: 'ИИ таргетолог',
    ActiveIcon: TargetologActive,
    InactiveIcon: TargetologInactive,
  },
  {
    path: '/profile',
    label: 'Профиль',
    ActiveIcon: ProfileActive,
    InactiveIcon: ProfileInactive,
  },
];

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav-bar">
      {navItems.map(({ path, label, ActiveIcon, InactiveIcon }) => {
        const isActive = location.pathname === path;
        const Icon = isActive ? ActiveIcon : InactiveIcon;
        return (
          <button
            key={path}
            className={`nav-btn${isActive ? ' active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon className="nav-icon" />
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar; 