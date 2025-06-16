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
  right: 18px;
  top: 100%;
  background: ${({ theme }) => theme.card};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
  z-index: 10;
  min-width: 120px;
  margin-top: 4px;
  overflow: hidden;
  animation: fadeIn 0.18s;
`;
const ThemeDropdownOption = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: ${({ selected, theme }) => selected ? theme.primary : theme.text};
  font-size: 16px;
  font-weight: 600;
  padding: 12px 18px;
  text-align: left;
  cursor: pointer;
  background: ${({ selected, theme }) => selected ? theme.buttonSecondary : 'none'};
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: ${({ theme }) => theme.buttonSecondary};
    color: ${({ theme }) => theme.primary};
  }
`;

const FacebookModalOverlay = styled(ModalOverlay)`
  background: rgba(0,0,0,0.18);
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

export default function Profile() {
  const [tgUser, setTgUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeContext();
  const themeObj = themes[theme];
  const [themeDropdownPos, setThemeDropdownPos] = useState({top:0,left:0,width:0});
  const themeRowRef = useRef(null);

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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeDropdown(false);
  };

  const avatar = tgUser?.photo_url || '';
  const nickname = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'Имя пользователя';
  const tariff = tgUser?.tariff || 'Фрилансер';

  const handleThemeRowClick = () => {
    setShowThemeDropdown((prev) => !prev);
    if (themeRowRef.current) {
      const rect = themeRowRef.current.getBoundingClientRect();
      setThemeDropdownPos({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  };

  return (
    <Container theme={themeObj}>
      <ProfileHeader>
        <Avatar src={avatar || ''} alt={nickname} theme={themeObj} />
        <Nickname theme={themeObj}>{nickname}</Nickname>
      </ProfileHeader>
      <InfoBlock theme={themeObj} style={{position:'relative'}}>
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
        <InfoRow
          theme={themeObj}
          style={{cursor:'pointer', position:'relative'}}
          onClick={handleThemeRowClick}
          ref={themeRowRef}
        >
          <InfoTitle theme={themeObj}>Тема</InfoTitle>
          <InfoValue theme={themeObj}>
            {theme === 'dark' ? 'Тёмная' : 'Светлая'}
            <svg width="18" height="18" style={{marginLeft:8,transform:showThemeDropdown?'rotate(90deg)':'rotate(0deg)',transition:'transform 0.22s'}} viewBox="0 0 20 20" fill="none"><path d="M8 6L12 10L8 14" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </InfoValue>
          {showThemeDropdown && (
            <ThemeDropdown theme={themeObj} style={{minWidth:themeDropdownPos.width}}>
              <ThemeDropdownOption
                theme={themeObj}
                selected={theme==='light'}
                onClick={()=>handleThemeChange('light')}
              >Светлая</ThemeDropdownOption>
              <ThemeDropdownOption
                theme={themeObj}
                selected={theme==='dark'}
                onClick={()=>handleThemeChange('dark')}
              >Тёмная</ThemeDropdownOption>
            </ThemeDropdown>
          )}
        </InfoRow>
      </InfoBlock>
      <FacebookButton onClick={() => setShowModal(true)}>
        <FacebookIcon src={facebookIcon} alt="Facebook" />
        Подключить Facebook Ads Account
      </FacebookButton>
      <LogoutButton theme={themeObj}>Выйти</LogoutButton>
      {showModal && (
        <FacebookModalOverlay onClick={() => setShowModal(false)}>
          <FacebookModalWindow theme={themeObj} onClick={e => e.stopPropagation()}>
            <FacebookModalIcon src={megaphoneIcon} alt="Megaphone" />
            <FacebookModalTitle theme={themeObj}>Подключение рекламного аккаунта</FacebookModalTitle>
            <FacebookModalText theme={themeObj}>
              Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.
            </FacebookModalText>
            <div style={{fontWeight:600, color:themeObj.text, textAlign:'left', width:'100%', marginBottom:8}}>Это позволяет вам:</div>
            <FacebookModalList theme={themeObj}>
              <li>Использовать ИИ автопилот</li>
              <li>Получать советы и диагностику от ИИ</li>
              <li>Просматривать метрики</li>
              <li>Загружать креативы</li>
            </FacebookModalList>
            <FacebookModalButton theme={themeObj} onClick={()=>setShowModal(false)}>
              Подключить рекламный аккаунт
            </FacebookModalButton>
          </FacebookModalWindow>
        </FacebookModalOverlay>
      )}
      <BottomNavigation activeTab="/profile" />
    </Container>
  );
} 
