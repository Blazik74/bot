import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import facebookIcon from '../assets/icons/facebook.svg';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import profileIcon from '../assets/icons/profile.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 36px 0 24px 0;
`;

const Avatar = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 3px solid #005EFF;
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#181A1B'};
  margin-bottom: 12px;
`;

const InfoTable = styled.div`
  background: #E5E8EB;
  border-radius: 12px;
  margin: 0 16px 18px 16px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #D1D5DB;
  &:last-child { border-bottom: none; }
`;

const InfoTitle = styled.div`
  flex: 0 0 110px;
  font-weight: 700;
  color: #181A1B;
  font-size: 16px;
  padding-left: 18px;
`;

const InfoValue = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 400;
  color: #181A1B;
  font-size: 16px;
  padding-right: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Arrow = styled.span`
  margin-left: 8px;
  display: inline-block;
  transition: transform 0.3s;
  transform: rotate(${({ open }) => (open ? 90 : 0)}deg);
`;

const FacebookButton = styled.button`
  width: 90%;
  max-width: 370px;
  padding: 14px 0;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 18px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.3s, color 0.3s;
`;

const ExitButton = styled.button`
  width: 90%;
  max-width: 370px;
  padding: 14px 0;
  background: #E5E8EB;
  color: #005EFF;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 18px auto 0 auto;
  transition: background 0.3s, color 0.3s;
`;

const ThemeSelectPanel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  background: #E5E8EB;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  z-index: 10;
  padding: 0 0 8px 0;
`;

const ThemeOption = styled.div`
  padding: 12px 18px;
  font-size: 16px;
  color: #181A1B;
  cursor: pointer;
  &:hover { background: #D1D5DB; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWindow = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 32px 18px 24px 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
`;

const MegaphoneIcon = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 18px;
`;

const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #181A1B;
`;

const ModalText = styled.div`
  font-size: 16px;
  color: #181A1B;
  margin-bottom: 18px;
`;

const ModalList = styled.ul`
  text-align: left;
  margin: 0 0 18px 0;
  padding-left: 18px;
  color: #181A1B;
  font-size: 15px;
`;

const Profile = () => {
  const theme = useTheme().theme || 'light';
  const [tgUser, setTgUser] = useState(null);
  const [themePanel, setThemePanel] = useState(false);
  const [themeValue, setThemeValue] = useState('light');
  const [showModal, setShowModal] = useState(false);
  const themePanelRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (themePanelRef.current && !themePanelRef.current.contains(e.target)) {
        setThemePanel(false);
      }
    }
    if (themePanel) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themePanel]);

  const avatar = tgUser?.photo_url || profileIcon;
  const name = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'username';

  return (
    <Container theme={theme}>
      <ProfileHeader>
        <Avatar src={avatar} alt={name} />
        <Name theme={theme}>{name}</Name>
      </ProfileHeader>
      <InfoTable>
        <InfoRow>
          <InfoTitle>Аккаунт</InfoTitle>
          <InfoValue>{username}</InfoValue>
        </InfoRow>
        <InfoRow style={{ cursor: 'pointer' }} onClick={() => navigate('/tariffs')}>
          <InfoTitle>Тариф</InfoTitle>
          <InfoValue>Фрилансер <Arrow>›</Arrow></InfoValue>
        </InfoRow>
        <InfoRow style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setThemePanel(v => !v)}>
          <InfoTitle>Тема</InfoTitle>
          <InfoValue>
            {themeValue === 'dark' ? 'Темная' : 'Светлая'}
            <Arrow open={themePanel}>›</Arrow>
          </InfoValue>
          {themePanel && (
            <ThemeSelectPanel ref={themePanelRef}>
              <ThemeOption onClick={() => { setThemeValue('light'); setThemePanel(false); }}>Светлая</ThemeOption>
              <ThemeOption onClick={() => { setThemeValue('dark'); setThemePanel(false); }}>Темная</ThemeOption>
            </ThemeSelectPanel>
          )}
        </InfoRow>
      </InfoTable>
      <FacebookButton onClick={() => setShowModal(true)}>
        <img src={facebookIcon} alt="Facebook" width={22} height={22} />
        Подключить Facebook Ads Account
      </FacebookButton>
      <ExitButton>Выйти</ExitButton>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalWindow onClick={e => e.stopPropagation()}>
            <MegaphoneIcon src={megaphoneIcon} alt="Megaphone" />
            <ModalTitle>Подключение рекламного аккаунта</ModalTitle>
            <ModalText>Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.</ModalText>
            <ModalList>
              <li>Использовать ИИ автопилот</li>
              <li>Получать советы и диагностику от ИИ</li>
              <li>Просматривать метрики</li>
              <li>Загружать креативы</li>
            </ModalList>
            <FacebookButton style={{ width: '100%', margin: 0 }}>Подключить рекламный аккаунт</FacebookButton>
          </ModalWindow>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Profile; 
