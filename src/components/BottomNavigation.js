import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import aiCenterIconActive from '../assets/icons/ai-center-active.svg';
import targetologIcon from '../assets/icons/targetolog.svg';
import targetologIconActive from '../assets/icons/targetolog-active.svg';
import profileIcon from '../assets/icons/profile.svg';
import profileIconActive from '../assets/icons/profile-active.svg';

const Navigation = styled.nav`
  position: fixed;
  bottom: 24px;
  left: 12px;
  right: 12px;
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#fff'};
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #E5E8EB;
  border-radius: 22px 22px 0 0;
  z-index: 100;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
  transition: background 0.3s;
  &::after {
    content: '';
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#fff'};
    z-index: -1;
    pointer-events: none;
  }
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
  color: ${({ active }) => active ? '#005EFF' : '#BDBDBD'};
  font-weight: ${({ active }) => active ? 700 : 500};
  position: relative;
  font-size: 15px;
  &:after {
    content: '';
    display: ${({ active }) => active ? 'block' : 'none'};
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 5px;
    border-radius: 3px;
    background: #181A1B;
    width: 100%;
  }
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
  font-size: 14px;
  font-weight: ${({ active }) => active ? 700 : 500};
  color: ${({ active }) => active ? '#005EFF' : '#BDBDBD'};
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
  const theme = useTheme().theme || 'light';
  return (
    <Navigation theme={theme}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/' && (location.pathname === '/' || location.pathname === '/ai-center'));
        return (
          <NavButton
            key={item.path}
            onClick={() => navigate(item.path)}
            active={isActive}
          >
            <IconWrapper>
              <img src={isActive ? item.iconActive : item.icon} alt={item.label} />
            </IconWrapper>
            <Label active={isActive}>{item.label}</Label>
          </NavButton>
        );
      })}
    </Navigation>
  );
}; 
