import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import homeIcon from '../assets/icons/home.svg';
import homeActiveIcon from '../assets/icons/home-active.svg';
import profileIcon from '../assets/icons/profile.svg';
import profileActiveIcon from '../assets/icons/profile-active.svg';
import targetIcon from '../assets/icons/target.svg';
import targetActiveIcon from '../assets/icons/target-active.svg';

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 88px;
  min-height: 88px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  border-top: 1px solid ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#E5E8EB'};
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  &:active {
    transform: scale(0.95);
  }
`;

const NavIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
`;

const NavText = styled.span`
  font-size: 12px;
  color: ${({ theme, active }) => active ? theme.primary : theme.text};
  transition: color 0.3s;
`;

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const navItems = [
    { path: '/', icon: homeIcon, activeIcon: homeActiveIcon, text: 'Главная' },
    { path: '/target', icon: targetIcon, activeIcon: targetActiveIcon, text: 'ИИ Центр' },
    { path: '/profile', icon: profileIcon, activeIcon: profileActiveIcon, text: 'Профиль' }
  ];

  return (
    <NavContainer theme={theme}>
      {navItems.map(({ path, icon, activeIcon, text }) => (
        <NavItem key={path} onClick={() => navigate(path)}>
          <NavIcon src={location.pathname === path ? activeIcon : icon} alt={text} />
          <NavText theme={theme} active={location.pathname === path}>{text}</NavText>
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default BottomNav; 
