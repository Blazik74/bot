import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import aiCenterBlueIcon from '../assets/icons/ai-center-blue.svg';
import targetologGreyIcon from '../assets/icons/targetolog-grey.svg';
import profileGreyIcon from '../assets/icons/profile-grey.svg';

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

  return (
    <NavigationContainer>
      <NavButton onClick={() => navigate('/')}> 
        <IconWrapper>
          <img src={aiCenterBlueIcon} alt="ИИ Центр" />
        </IconWrapper>
        <Label>ИИ Центр</Label>
      </NavButton>

      <NavButton onClick={() => navigate('/targetolog')}>
        <IconWrapper>
          <img src={targetologGreyIcon} alt="ИИ Таркетолог" />
        </IconWrapper>
        <Label>ИИ Таркетолог</Label>
      </NavButton>

      <NavButton onClick={() => navigate('/profile')}>
        <IconWrapper>
          <img src={profileGreyIcon} alt="Профиль" />
        </IconWrapper>
        <Label>Профиль</Label>
      </NavButton>
    </NavigationContainer>
  );
};

export default BottomNavigation; 
