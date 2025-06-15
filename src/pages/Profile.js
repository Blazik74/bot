import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';
import BottomNavigation from '../components/BottomNavigation';

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
  transform: ${({ open }) => open ? 'rotate(180deg)' : 'rotate(90deg)'};
`;

const ThemeRow = styled(InfoRow)`
  cursor: pointer;
  position: relative;
  z-index: 2000;
`;

const ArrowSvg = styled.svg`
  width: 18px;
  height: 18px;
  margin-left: 8px;
  transition: transform 0.22s cubic-bezier(.4,0,.2,1);
  transform: ${({ open }) => open ? 'rotate(90deg)' : 'rotate(0deg)'};
  display: inline-block;
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
  text-align: left;
  margin: 0 0 18px 0;
  padding-left: 18px;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
`;

const ThemeDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 16px;
  left: auto;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  z-index: 2000;
  transform: ${({ isOpen }) => isOpen ? 'scaleY(1)' : 'scaleY(0)'};
  transform-origin: top;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  pointer-events: ${({ isOpen }) => isOpen ? 'auto' : 'none'};
  transition: transform 0.22s cubic-bezier(.4,0,.2,1), opacity 0.18s;
`;

const ThemeOption = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.buttonSecondary};
  }
  
  &:active {
    background: ${({ theme }) => theme.buttonSecondary};
    opacity: 0.8;
  }
`;

const ThemeIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme === 'dark' ? '#fff' : '#000'};
  border: 2px solid ${({ theme }) => theme.border};
`;

export default function Profile() {
  const [tgUser, setTgUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeContext();
  const themeObj = themes[theme];

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowThemeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeDropdown(false);
  };

  const avatar = tgUser?.photo_url || '';
  const nickname = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'Имя пользователя';
  const tariff = tgUser?.tariff || 'Фрилансер';

  return (
    <Container theme={themeObj}>
      <ProfileHeader>
        <Avatar src={avatar || ''} alt={nickname} theme={themeObj} />
        <Nickname theme={themeObj}>{nickname}</Nickname>
      </ProfileHeader>
      <InfoBlock theme={themeObj}>
        <InfoRow theme={themeObj}>
          <InfoTitle theme={themeObj}>Аккаунт</InfoTitle>
          <InfoValue theme={themeObj}>{username}</InfoValue>
        </InfoRow>
        <InfoRow theme={themeObj}>
          <InfoTitle theme={themeObj}>Тариф</InfoTitle>
          <InfoValue theme={themeObj}>
            <TariffButton theme={themeObj} onClick={() => navigate('/tariffs')}>{tariff} <span style={{fontSize:20,marginLeft:4}}>&#8250;</span></TariffButton>
          </InfoValue>
        </InfoRow>
        <ThemeRow theme={themeObj} ref={dropdownRef}>
          <InfoTitle theme={themeObj}>Тема</InfoTitle>
          <InfoValue theme={themeObj} onClick={() => setShowThemeDropdown(v => !v)} style={{cursor:'pointer'}}>
            {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            <ArrowSvg open={showThemeDropdown} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6L12 10L8 14" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </ArrowSvg>
          </InfoValue>
          <ThemeDropdown isOpen={showThemeDropdown} theme={themeObj}>
            <ThemeOption theme={themeObj} onClick={() => handleThemeChange('light')}>
              <ThemeIcon theme="light" />
              Светлая
            </ThemeOption>
            <ThemeOption theme={themeObj} onClick={() => handleThemeChange('dark')}>
              <ThemeIcon theme="dark" />
              Тёмная
            </ThemeOption>
          </ThemeDropdown>
        </ThemeRow>
      </InfoBlock>
      <FacebookButton onClick={() => setShowModal(true)}>
        <FacebookIcon src={facebookIcon} alt="Facebook" />
        Подключить Facebook Ads Account
      </FacebookButton>
      <LogoutButton theme={themeObj}>Выйти</LogoutButton>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalWindow theme={themeObj} onClick={e => e.stopPropagation()}>
            <MegaphoneIcon src={megaphoneIcon} alt="Megaphone" />
            <ModalTitle theme={themeObj}>Подключение рекламного аккаунта</ModalTitle>
            <ModalText theme={themeObj}>Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.</ModalText>
            <ModalList theme={themeObj}>
              <li>Использовать ИИ автопилот</li>
              <li>Получать советы и диагностику от ИИ</li>
              <li>Просматривать метрики</li>
              <li>Загружать креативы</li>
            </ModalList>
            <ModalButton theme={themeObj} onClick={() => setShowModal(false)}>Ок</ModalButton>
          </ModalWindow>
        </ModalOverlay>
      )}
      <BottomNavigation activeTab="/profile" />
    </Container>
  );
} 
