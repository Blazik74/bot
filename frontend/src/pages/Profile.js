import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';
import BottomNavigation from '../components/BottomNavigation';
import axios from 'axios';
import api, { facebookAuth, userApi } from '../api';
import { useUser } from '../contexts/UserContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 80px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 36px;
`;

const Avatar = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: ${({ theme }) => theme.card};
  margin-bottom: 18px;
`;

const Nickname = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 18px;
`;

const InfoBlock = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  margin: 0 16px 18px 16px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-child { border-bottom: none; }
`;

const InfoTitle = styled.div`
  flex: 0 0 110px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  padding-left: 18px;
`;

const InfoValue = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 400;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  padding-right: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TariffButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  font-weight: 400;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ArrowAnim = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
`;

const Arrow = styled.span`
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  transform: ${({ open }) => open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const ArrowRight = styled.svg`
  width: 18px;
  height: 18px;
  margin-left: 8px;
  fill: ${({ theme }) => theme.text};
`;

const ArrowDown = styled.svg`
  width: 18px;
  height: 18px;
  margin-left: 8px;
  fill: ${({ theme }) => theme.text};
`;

const FacebookButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  padding: 16px;
  background: #1877F3;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s;
  box-shadow: none;
  &:hover {
    background: #166fe0;
  }
`;

const FacebookIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

const FacebookProfileCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  margin: 0 16px 16px 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const FacebookAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f0f0;
`;

const FacebookInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FacebookName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 4px;
`;

const FacebookStatus = styled.div`
  font-size: 14px;
  color: #1877F3;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWindow = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 32px 18px 0 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 18px;
`;

const ModalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 20px;
  font-weight: 600;
  margin: 18px 0 18px 0;
  cursor: pointer;
`;

const MegaphoneIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 18px;
`;

const ModalText = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 18px;
`;

const ModalList = styled.ul`
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  margin-bottom: 32px;
  padding-left: 18px;
  text-align: left;
`;

const FacebookModalOverlay = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FacebookModalWindow = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 32px 18px 24px 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FacebookModalIcon = styled.img`
  width: 64px;
  height: 64px;
  margin: 0 auto 18px auto;
  display: block;
`;

const FacebookModalTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 18px;
`;

const FacebookModalText = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 18px;
`;

const FacebookModalList = styled.ul`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  margin-bottom: 32px;
  padding-left: 18px;
  text-align: left;
`;

const FacebookModalButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  width: 100%;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: block;
`;

const ThemeModalOverlay = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThemeModalWindow = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 32px 18px 24px 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.12);
`;

const ThemeOption = styled.div`
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ selected, theme }) => selected ? theme.primary : 'transparent'};
  color: ${({ selected, theme }) => selected ? theme.buttonText : theme.text};
  font-weight: ${({ selected }) => selected ? '600' : '400'};
`;

const LoaderAnim = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const SkeletonBlock = styled.div`
  height: 120px;
  border-radius: 18px;
  background: ${({ theme }) => theme.card};
  margin: 24px 16px;
  animation: ${LoaderAnim} 1.2s infinite;
`;

export default function Profile() {
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showFbInfo, setShowFbInfo] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeContext();
  const { user } = useUser();
  const themeObj = themes[theme];

  // Данные пользователя
  const avatarUrl = user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
  const name = user?.name || 'Имя';
  const username = user?.username || 'Имя пользователя';
  const tariff = user?.tariff?.name || 'Нет';

  // --- Theme Modal ---
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeModal(false);
  };

  // --- Facebook ---
  const handleFbLogin = () => {
    setShowFbInfo(false);
    // Здесь должен быть реальный вызов авторизации Facebook
    window.location.href = '/facebook-connect';
  };

  // --- Render ---
  return (
    <Container theme={themeObj}>
      <ProfileHeader>
        <Avatar src={avatarUrl} alt="User Avatar" />
        <Nickname>{name}</Nickname>
      </ProfileHeader>
      <InfoBlock theme={themeObj}>
        <InfoRow theme={themeObj}>
          <InfoTitle>Аккаунт</InfoTitle>
          <InfoValue>{username}</InfoValue>
        </InfoRow>
        <InfoRow theme={themeObj} style={{cursor:'pointer'}} onClick={()=>navigate('/tariffs')}>
          <InfoTitle>Тариф</InfoTitle>
          <InfoValue>
            {tariff}
            <ArrowRight theme={themeObj} viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></ArrowRight>
          </InfoValue>
        </InfoRow>
        <InfoRow theme={themeObj} style={{cursor:'pointer'}} onClick={()=>setShowThemeModal(true)}>
          <InfoTitle>Тема</InfoTitle>
          <InfoValue>
            {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            <ArrowDown theme={themeObj} viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></ArrowDown>
          </InfoValue>
        </InfoRow>
      </InfoBlock>
      {/* Facebook connect block */}
      {!showFbInfo ? (
        <FacebookButton onClick={()=>setShowFbInfo(true)}>
          <FacebookIcon src={facebookIcon} />
          Подключить Facebook Ads Account
        </FacebookButton>
      ) : (
        <FacebookModalOverlay onClick={()=>setShowFbInfo(false)}>
          <FacebookModalWindow theme={themeObj} onClick={e=>e.stopPropagation()}>
            <FacebookModalIcon src={megaphoneIcon} />
            <FacebookModalTitle>Подключение рекламного аккаунта</FacebookModalTitle>
            <FacebookModalText>
              Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.
            </FacebookModalText>
            <FacebookModalList>
              <li>Использовать ИИ автопилот</li>
              <li>Получать советы и диагностику от ИИ</li>
              <li>Просматривать метрики</li>
              <li>Загружать креативы</li>
            </FacebookModalList>
            <FacebookModalButton onClick={handleFbLogin}>
              Подключить рекламный аккаунт
            </FacebookModalButton>
          </FacebookModalWindow>
        </FacebookModalOverlay>
      )}
      <LogoutButton theme={themeObj} onClick={()=>{localStorage.removeItem('authToken');navigate(0);}}>
        Выйти
      </LogoutButton>
      {/* Theme modal */}
      {showThemeModal && (
        <ThemeModalOverlay onClick={()=>setShowThemeModal(false)}>
          <ThemeModalWindow theme={themeObj} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:22,fontWeight:700,marginBottom:24,textAlign:'center'}}>Выберите тему</div>
            <ThemeOption selected={theme==='light'} onClick={()=>handleThemeChange('light')}>Светлая</ThemeOption>
            <ThemeOption selected={theme==='dark'} onClick={()=>handleThemeChange('dark')}>Тёмная</ThemeOption>
          </ThemeModalWindow>
        </ThemeModalOverlay>
      )}
    </Container>
  );
} 
