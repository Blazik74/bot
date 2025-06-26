import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import aiCenterIconActive from '../assets/icons/ai-center-active.svg';
import targetologIcon from '../assets/icons/targetolog.svg';
import targetologIconActive from '../assets/icons/targetolog-active.svg';
import profileIcon from '../assets/icons/profile.svg';
import profileIconActive from '../assets/icons/profile-active.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.background};
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border};
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
  gap: 0px;
  background: none;
  border: none;
  padding: 0 0 0 0;
  cursor: pointer;
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  img {
    width: 32px;
    height: 32px;
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
    path: '/tariffs',
    label: 'Тарифы',
    icon: profileIcon,
    iconActive: profileIconActive
  }
];

export const BottomNavigation = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeContext() || {};
  const themeObj = themes[theme] || themes.light;
  return (
    <Navigation theme={themeObj}>
      {navigationItems.map((item) => {
        const isActive = activeTab
          ? activeTab === item.path
          : location.pathname === item.path;
        return (
          <NavButton
            key={item.path}
            onClick={() => navigate(item.path)}
            active={isActive}
            theme={themeObj}
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

export default BottomNavigation; 
