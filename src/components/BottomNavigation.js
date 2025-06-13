import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import targetologIcon from '../assets/icons/targetolog.svg';
import profileIcon from '../assets/icons/profile.svg';

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 0 0 4px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #E5E8EB;
  z-index: 100;
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
    icon: aiCenterIcon
  },
  {
    path: '/targetolog',
    label: 'ИИ таргетолог',
    icon: targetologIcon
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
  return (
    <Navigation>
      {navigationItems.map((item) => (
        <NavButton
          key={item.path}
          onClick={() => navigate(item.path)}
          active={location.pathname === item.path || (item.path === '/' && location.pathname === '/ai-center')}
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
