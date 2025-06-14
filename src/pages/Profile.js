import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import profileIcon from '../assets/icons/profile-icon.svg';
import { useTheme as useThemeContext } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'light' ? '#fff' : '#181A1B'};
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
  background: ${({ theme }) => theme === 'light' ? '#E5E8EB' : '#2D2E33'};
  margin-bottom: 18px;
`;

const Nickname = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'light' ? '#181A1B' : '#E5E8EB'};
  margin-bottom: 18px;
`;

const InfoBlock = styled.div`
  background: ${({ theme }) => theme === 'light' ? '#E5E8EB' : '#2D2E33'};
  border-radius: 12px;
  margin: 0 16px 18px 16px;
  overflow: hidden;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid ${({ theme }) => theme === 'light' ? '#D1D5DB' : '#4D4F53'};
  &:last-child { border-bottom: none; }
`;

const InfoTitle = styled.div`
  flex: 0 0 110px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'light' ? '#181A1B' : '#E5E8EB'};
  font-size: 16px;
  padding-left: 18px;
`;

const InfoValue = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 400;
  color: ${({ theme }) => theme === 'light' ? '#181A1B' : '#E5E8EB'};
  font-size: 16px;
  padding-right: 18px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TariffButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme === 'light' ? '#181A1B' : '#E5E8EB'};
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
  transition: transform 0.3s;
  transform: ${({ open }) => open ? 'rotate(180deg)' : 'rotate(0)'};
`;

const ThemeRow = styled(InfoRow)`
  cursor: pointer;
`;

const FacebookButton = styled.button`
  width: calc(100% - 32px);
  margin: 0 16px 16px 16px;
  padding: 16px;
  background: ${({ theme }) => theme === 'light' ? '#1877F2' : '#2D2E33'};
  color: ${({ theme }) => theme === 'light' ? '#fff' : '#E5E8EB'};
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
  background: ${({ theme }) => theme === 'light' ? '#E5E8EB' : '#2D2E33'};
  color: ${({ theme }) => theme === 'light' ? '#005EFF' : '#E5E8EB'};
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
  background: ${({ theme }) => theme === 'light' ? '#E5E8EB' : '#2D2E33'};
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
  color: ${({ theme }) => theme === 'light' ? '#B71C1C' : '#E5E8EB'};
  margin-bottom: 18px;
`;

const ModalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme === 'light' ? '#BDBDBD' : '#4D4F53'};
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme === 'light' ? '#005EFF' : '#E5E8EB'};
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
  color: ${({ theme }) => theme === 'light' ? '#181A1B' : '#E5E8EB'};
  margin-bottom: 18px;
`;

const ModalList = styled.ul`
  text-align: left;
  margin: 0 0 18px 0;
  padding-left: 18px;
  color: ${({ theme }) => theme === 'light' ? '#181A1B' : '#E5E8EB'};
  font-size: 16px;
`;

export default function Profile() {
  const [tgUser, setTgUser] = useState(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showFbModal, setShowFbModal] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, setTheme } = useTheme();
  const theme = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  const avatar = tgUser?.photo_url || profileIcon;
  const nickname = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'Имя пользователя';
  const tariff = tgUser?.tariff || 'Фрилансер';

  return (
    <Container theme={theme}>
      <ProfileHeader>
        <Avatar src={avatar} alt={nickname} theme={theme} />
        <Nickname theme={theme}>{nickname}</Nickname>
      </ProfileHeader>
      <InfoBlock theme={theme}>
        <InfoRow theme={theme}>
          <InfoTitle theme={theme}>Аккаунт</InfoTitle>
          <InfoValue theme={theme}>{username}</InfoValue>
        </InfoRow>
        <InfoRow theme={theme}>
          <InfoTitle theme={theme}>Тариф</InfoTitle>
          <InfoValue theme={theme}>
            <TariffButton theme={theme} onClick={() => navigate('/tariffs')}>{tariff} <span style={{fontSize:20,marginLeft:4}}>&#8250;</span></TariffButton>
          </InfoValue>
        </InfoRow>
        <ThemeRow theme={theme} onClick={() => setShowThemeDropdown(v => !v)}>
          <InfoTitle theme={theme}>Тема</InfoTitle>
          <InfoValue theme={theme}>
            {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            <Arrow open={showThemeDropdown}>&#8250;</Arrow>
          </InfoValue>
        </ThemeRow>
        {showThemeDropdown && (
          <div style={{position:'relative',zIndex:10}}>
            <div style={{position:'absolute',right:18,top:0,background:theme==='dark'?'#23272F':'#fff',border:'1px solid #E5E8EB',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.08)',padding:'8px 0'}}>
              <div style={{padding:'8px 24px',cursor:'pointer',color:theme==='dark'?'#fff':'#181A1B'}} onClick={()=>{setTheme('light');setShowThemeDropdown(false);}}>Светлая</div>
              <div style={{padding:'8px 24px',cursor:'pointer',color:theme==='dark'?'#fff':'#181A1B'}} onClick={()=>{setTheme('dark');setShowThemeDropdown(false);}}>Тёмная</div>
            </div>
          </div>
        )}
      </InfoBlock>
      <FacebookButton theme={theme} onClick={() => setShowFbModal(true)}>
        <span style={{fontSize:22,marginRight:8}}><b>f</b></span>
        Подключить Facebook Ads Account
      </FacebookButton>
      <LogoutButton theme={theme}>Выйти</LogoutButton>
      {showFbModal && (
        <ModalOverlay onClick={() => setShowFbModal(false)}>
          <ModalWindow theme={theme} onClick={e => e.stopPropagation()}>
            <MegaphoneIcon src={megaphoneIcon} alt="Megaphone" />
            <ModalTitle theme={theme}>Подключение рекламного аккаунта</ModalTitle>
            <ModalText theme={theme}>Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.</ModalText>
            <ModalList theme={theme}>
              <li>Использовать ИИ автопилот</li>
              <li>Получать советы и диагностику от ИИ</li>
              <li>Просматривать метрики</li>
              <li>Загружать креативы</li>
            </ModalList>
            <ModalButton theme={theme} onClick={() => setShowFbModal(false)}>Ок</ModalButton>
          </ModalWindow>
        </ModalOverlay>
      )}
    </Container>
  );
} 
