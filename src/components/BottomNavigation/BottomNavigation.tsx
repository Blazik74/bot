import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'ai-center',
    label: 'ИИ Центр',
    icon: '/icons/ai-center.svg',
    activeIcon: '/icons/ai-center-active.svg',
    path: '/ai-center'
  },
  {
    id: 'active-ai',
    label: 'Включенная ИИ',
    icon: '/icons/active-ai.svg',
    activeIcon: '/icons/active-ai-active.svg',
    path: '/active-ai'
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: '/icons/profile.svg',
    activeIcon: '/icons/profile-active.svg',
    path: '/profile'
  }
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <img
              src={isActive ? item.activeIcon : item.icon}
              alt={item.label}
              className="nav-icon"
            />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}; 