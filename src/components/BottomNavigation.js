import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import aiCenterBlueIcon from '../assets/icons/ai-center-blue.svg';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import targetologistBlueIcon from '../assets/icons/targetologist-blue.svg';
import targetologistGrayIcon from '../assets/icons/targetologist-gray.svg';
import profileBlueIcon from '../assets/icons/profile-blue.svg';
import profileGrayIcon from '../assets/icons/profile-gray.svg';

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #E5E8EB;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 1000;
`;

const NavButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  opacity: 1;
  transition: none;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Label = styled.span`
  font-size: 12px;
  color: #222;
`;

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <NavigationContainer>
      <NavButton onClick={() => navigate('/')}> 
        <IconWrapper>
          <img src={location.pathname === '/' ? aiCenterBlueIcon : aiCenterIcon} alt="ИИ Центр" />
        </IconWrapper>
        <Label>ИИ Центр</Label>
      </NavButton>

      <NavButton onClick={() => navigate('/targetolog')}>
        <IconWrapper>
          <img src={location.pathname === '/targetolog' ? targetologistBlueIcon : targetologistGrayIcon} alt="ИИ Таркетолог" />
        </IconWrapper>
        <Label>ИИ Таркетолог</Label>
      </NavButton>

      <NavButton onClick={() => navigate('/profile')}>
        <IconWrapper>
          <img src={location.pathname === '/profile' ? profileBlueIcon : profileGrayIcon} alt="Профиль" />
        </IconWrapper>
        <Label>Профиль</Label>
      </NavButton>
    </NavigationContainer>
  );
};

export default BottomNavigation; 
