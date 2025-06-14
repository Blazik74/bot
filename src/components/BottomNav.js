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
  background: ${({ theme }) => theme === 'dark' ? 'linear-gradient(180deg, #181A1B 0%, #2C2F30 100%)' : 'linear-gradient(180deg, #fff 0%, #E5E8EB 100%)'};
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100px; /* Увеличенная высота */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-top: 1px solid ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#E5E8EB'};
  &::after {
    content: '';
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
    z-index: -1;
    pointer-events: none;
  }
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
  width: 28px; /* Увеличенные размеры иконок */
  height: 28px;
  margin-bottom: 6px; /* Увеличенное расстояние между иконкой и текстом */
  filter: ${({ active }) => active ? 'drop-shadow(0 0 3px #005EFF)' : 'none'};
`;

const NavText = styled.span`
  font-size: 14px; /* Увеличенный размер шрифта */
  color: ${({ active }) => active ? '#005EFF' : '#181A1B'};
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
          <NavIcon src={location.pathname === path ? activeIcon : icon} alt={text} active={location.pathname === path} />
          <NavText active={location.pathname === path}>{text}</NavText>
        </NavItem>
      ))}
    </NavContainer>
  );
};

export default BottomNav;
