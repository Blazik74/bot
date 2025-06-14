import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import aiCenterIconActive from '../assets/icons/ai-center-active.svg';
import targetologIcon from '../assets/icons/targetolog.svg';
import targetologIconActive from '../assets/icons/targetolog-active.svg';
import profileIcon from '../assets/icons/profile.svg';
import profileIconActive from '../assets/icons/profile-active.svg';
import { useThemeContext } from '../contexts/ThemeContext';

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#fff'};
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #E5E8EB;
  z-index: 100;
  box-shadow: 0 0 12px 0 rgba(0,0,0,0.04);
  transition: background 0.3s;
  height: 84px;
  min-height: 84px;
  padding-bottom: env(safe-area-inset-bottom, 16px);
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  padding: 8px 0 0 0;
  cursor: pointer;
  color: ${({ active, theme }) => active ? '#005EFF' : (theme === 'dark' ? '#BDBDBD' : '#BDBDBD')};
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
`;

const navigationItems = [
  {
    path: '/',
    label: 'ИИ центр',
    icon: aiCenterIcon,
    iconActive: aiCenterIconActive
  },
  {
    path: '/targetolog',
    label: 'ИИ таргетолог',
    icon: targetologIcon,
    iconActive: targetologIconActive
  },
  {
    path: '/profile',
    label: 'Профиль',
    icon: profileIcon,
    iconActive: profileIconActive
  }
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeContext() || {};
  return (
    <Navigation theme={theme}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavButton
            key={item.path}
            onClick={() => navigate(item.path)}
            active={isActive}
            theme={theme}
          >
            <IconWrapper>
              <img src={isActive ? item.iconActive : item.icon} alt={item.label} />
            </IconWrapper>
            <Label>{item.label}</Label>
          </NavButton>
        );
      })}
    </Navigation>
  );
}; 
