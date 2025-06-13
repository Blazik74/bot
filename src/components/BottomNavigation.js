import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

// Импортируем SVG иконки
import homeIcon from '../assets/icons/home.svg';
import targetologIcon from '../assets/icons/targetolog.svg';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import profileIcon from '../assets/icons/profile.svg';

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.card};
  padding: 8px 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border};
  transition: background 0.3s, border-color 0.3s;
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: ${({ active, theme }) => active ? theme.primary : theme.text}80;
  transition: color 0.3s;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

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
    label: 'Главная',
    icon: homeIcon
  },
  {
    path: '/targetolog',
    label: 'Таргетолог',
    icon: targetologIcon
  },
  {
    path: '/ai-center',
    label: 'AI Центр',
    icon: aiCenterIcon
  },
  {
    path: '/profile',
    label: 'Профиль',
    icon: profileIcon
  }
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <Navigation theme={theme}>
      {navigationItems.map((item) => (
        <NavButton
          key={item.path}
          onClick={() => navigate(item.path)}
          active={location.pathname === item.path}
          theme={theme}
        >
          <IconWrapper>
            <img src={item.icon} alt={item.label} />
          </IconWrapper>
          <Label>{item.label}</Label>
        </NavButton>
      ))}
    </Navigation>
  );
}; 
