import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
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
  background: #E5E8EB;
  margin-bottom: 18px;
`;

const Nickname = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #181A1B;
  margin-bottom: 18px;
`;

const InfoBlock = styled.div`
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

const TariffButton = styled.button`
  background: none;
  border: none;
  color: #181A1B;
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

const ThemeDropdown = styled.div`
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
  background: #E5E8EB;
  color: #005EFF;
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
  background: #E5E8EB;
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
  color: #B71C1C;
  margin-bottom: 18px;
`;

const ModalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #BDBDBD;
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: #005EFF;
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
  color: #181A1B;
  margin-bottom: 18px;
`;

const ModalList = styled.ul`
  text-align: left;
  margin: 0 0 18px 0;
  padding-left: 18px;
  color: #181A1B;
  font-size: 16px;
`;

export default function Profile() {
  const [tgUser, setTgUser] = useState(null);
  const [themePanel, setThemePanel] = useState(false);
  const [themeValue, setThemeValue] = useState('Светлая');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const themePanelRef = useRef();

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

  const avatar = tgUser?.photo_url || '';
  const nickname = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'Имя пользователя';
  const tariff = tgUser?.tariff || 'Фрилансер';

  return (
    <Container>
      <ProfileHeader>
        <Avatar src={avatar} alt={nickname} />
        <Nickname>{nickname}</Nickname>
      </ProfileHeader>
      <InfoBlock>
        <InfoRow>
          <InfoTitle>Аккаунт</InfoTitle>
          <InfoValue>{username}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoTitle>Тариф</InfoTitle>
          <InfoValue>
            <TariffButton onClick={() => navigate('/tariffs')}>{tariff} <span style={{fontSize:20,marginLeft:4}}>&#8250;</span></TariffButton>
          </InfoValue>
        </InfoRow>
        <ThemeRow onClick={() => setThemePanel(v => !v)}>
          <InfoTitle>Тема</InfoTitle>
          <InfoValue>
            {themeValue}
            <Arrow open={themePanel}>&#8250;</Arrow>
          </InfoValue>
        </ThemeRow>
        {themePanel && (
          <ThemeDropdown ref={themePanelRef}>
            <ThemeOption onClick={() => { setThemeValue('Светлая'); setThemePanel(false); }}>Светлая</ThemeOption>
            <ThemeOption onClick={() => { setThemeValue('Темная'); setThemePanel(false); }}>Темная</ThemeOption>
          </ThemeDropdown>
        )}
      </InfoBlock>
      <FacebookButton onClick={() => setShowModal(true)}>
        <span style={{fontSize:22,marginRight:8}}><b>f</b></span>
        Подключить Facebook Ads Account
      </FacebookButton>
      <LogoutButton>Выйти</LogoutButton>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalWindow onClick={e => e.stopPropagation()}>
            <ModalTitle>Кампания остановлена</ModalTitle>
            <ModalDivider />
            <ModalButton onClick={() => setShowModal(false)}>Ok</ModalButton>
          </ModalWindow>
        </ModalOverlay>
      )}
    </Container>
  );
} 
