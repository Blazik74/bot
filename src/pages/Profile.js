import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import facebookIcon from '../assets/icons/facebook.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';
import BottomNavigation from '../components/BottomNavigation';
import axios from 'axios';
import api, { facebookAuth, userApi } from '../api';

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

export default function Profile() {
  const [tgUser, setTgUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showFbModal, setShowFbModal] = useState(false);
  const [fbProfile, setFbProfile] = useState(null);
  const [isFbConnected, setIsFbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useThemeContext();
  const themeObj = themes[theme];

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
  }, []);

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

  useEffect(() => {
    // Проверяем токен в URL (после Facebook авторизации)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const fbName = params.get('fb_name');
    
    if (token) {
      localStorage.setItem('authToken', token);
      if (fbName) {
        setFbProfile({ name: fbName });
        setIsFbConnected(true);
      }
      // Очищаем URL
      navigate('/profile', { replace: true });
    }
    
    // Проверяем подключение к Facebook
    checkFacebookConnection();
  }, [location, navigate]);

  const checkFacebookConnection = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Проверяем статус подключения
        const meResponse = await userApi.getMe();
        if (meResponse.data.facebook_connected) {
          setIsFbConnected(true);
          // Получаем профиль Facebook
          try {
            const fbResponse = await facebookAuth.getProfile();
            setFbProfile(fbResponse.data);
          } catch (error) {
            console.log('Facebook profile not available');
          }
        }
      }
    } catch (error) {
      console.log('Not authenticated or Facebook not connected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeDropdown(false);
  };

  const avatar = tgUser?.photo_url || '';
  const nickname = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'Имя пользователя';
  const tariff = tgUser?.tariff || 'Фрилансер';

  const handleFbLogin = () => {
    facebookAuth.login();
  };

  const handleFbLogout = async () => {
    try {
      await facebookAuth.logout();
      setFbProfile(null);
      setIsFbConnected(false);
    } catch (error) {
      console.error('Error logging out from Facebook:', error);
    }
  };

  const handleConnectFbClick = () => {
    setShowFbModal(true);
  };

  const handleFacebookProfileClick = () => {
    // Открываем профиль Facebook в новой вкладке
    window.open('https://www.facebook.com/profile.php', '_blank');
  };

  if (isLoading) {
    return (
      <Container theme={themeObj}>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
      </Container>
    );
  }

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
        <InfoRow theme={themeObj} style={{cursor:'pointer'}} onClick={() => setShowThemeDropdown(true)}>
          <InfoTitle theme={themeObj}>Тема</InfoTitle>
          <InfoValue theme={themeObj}>
            {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            <svg width="18" height="18" style={{marginLeft:8,transform:showThemeDropdown?'rotate(90deg)':'rotate(0deg)',transition:'transform 0.22s'}} viewBox="0 0 20 20" fill="none"><path d="M8 6L12 10L8 14" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </InfoValue>
        </InfoRow>
      </InfoBlock>
      
      {isFbConnected && fbProfile ? (
        <>
          <FacebookProfileCard theme={themeObj} onClick={handleFacebookProfileClick}>
            <FacebookAvatar src={fbProfile.picture || facebookIcon} alt={fbProfile.name} />
            <FacebookInfo>
              <FacebookName theme={themeObj}>{fbProfile.name}</FacebookName>
              <FacebookStatus>Подключен к Facebook</FacebookStatus>
            </FacebookInfo>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L13 10L7 16" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </FacebookProfileCard>
          <LogoutButton theme={themeObj} onClick={handleFbLogout}>
            Отключить Facebook
          </LogoutButton>
        </>
      ) : (
        <FacebookButton onClick={handleConnectFbClick}>
          <FacebookIcon src={facebookIcon} />
          Подключить Facebook
        </FacebookButton>
      )}
      
      {showFbModal && (
        <FacebookModalOverlay onClick={() => setShowFbModal(false)}>
          <FacebookModalWindow theme={themeObj} onClick={e => e.stopPropagation()}>
            <FacebookModalIcon src={facebookIcon} />
            <FacebookModalTitle>Подключение Facebook</FacebookModalTitle>
            <FacebookModalText>
              Для доступа к управлению кампаниями необходимо предоставить разрешения.
            </FacebookModalText>
            <FacebookModalList>
              <li>Управление рекламными кампаниями</li>
              <li>Чтение статистики по рекламе</li>
            </FacebookModalList>
            <FacebookModalButton onClick={handleFbLogin}>
              Перейти к подключению
            </FacebookModalButton>
          </FacebookModalWindow>
        </FacebookModalOverlay>
      )}
      
      {showThemeDropdown && (
        <ThemeModalOverlay onClick={() => setShowThemeDropdown(false)}>
          <ThemeModalWindow theme={themeObj} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:22,fontWeight:700,marginBottom:24,textAlign:'center'}}>Выберите тему</div>
            <ThemeOption selected={theme==='light'} onClick={()=>handleThemeChange('light')}>Светлая</ThemeOption>
            <ThemeOption selected={theme==='dark'} onClick={()=>handleThemeChange('dark')}>Тёмная</ThemeOption>
          </ThemeModalWindow>
        </ThemeModalOverlay>
      )}
      
      <BottomNavigation activeTab="/profile" />
    </Container>
  );
} 
