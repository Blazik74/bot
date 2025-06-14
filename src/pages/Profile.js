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
  padding-bottom: 80px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 16px 24px 16px;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
  border: 2px solid ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#E5E8EB'};
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  margin-bottom: 4px;
`;

const Username = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#E5E8EB' : '#666'};
  margin-bottom: 24px;
`;

const TariffButton = styled.button`
  background: none;
  border: none;
  color: #005EFF;
  font-size: 16px;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
  margin-bottom: 32px;
`;

const ThemeSection = styled.div`
  width: 100%;
  padding: 0 16px;
  margin-bottom: 24px;
`;

const ThemeButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  padding: 16px;
  cursor: pointer;
  border-radius: 12px;
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#F6F8FA'};
`;

const ThemeText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const ThemeArrow = styled.img`
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.3s;
`;

const ThemeDropdown = styled.div`
  margin-top: 8px;
  border-radius: 12px;
  overflow: hidden;
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#F6F8FA'};
`;

const ThemeOption = styled.button`
  width: 100%;
  text-align: left;
  padding: 16px;
  background: none;
  border: none;
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme === 'dark' ? '#3C3F40' : '#E5E8EB'};
  }
`;

const FacebookButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  padding: 16px;
  background: #1877F2;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const LogoutButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 16px;
  background: #F44336;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
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
      <Username>{username}</Username>
      <TariffButton onClick={() => navigate('/tariffs')}>Тариф</TariffButton>
      <ThemeSection>
        <ThemeButton onClick={() => setThemePanel(v => !v)}>
          <ThemeText>Тема</ThemeText>
          <ThemeArrow isOpen={themePanel} />
        </ThemeButton>
        {themePanel && (
          <ThemeDropdown>
            <ThemeOption onClick={() => { setThemeValue('light'); setThemePanel(false); }}>Светлая</ThemeOption>
            <ThemeOption onClick={() => { setThemeValue('dark'); setThemePanel(false); }}>Темная</ThemeOption>
          </ThemeDropdown>
        )}
      </ThemeSection>
      <FacebookButton onClick={() => setShowModal(true)}>
        <img src={facebookIcon} alt="Facebook" width={22} height={22} />
        Подключить Facebook Ads Account
      </FacebookButton>
      <LogoutButton>Выйти</LogoutButton>
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
