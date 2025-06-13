import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import useStore from '../store';
import facebookIcon from '../assets/icons/facebook.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 32px 0;
  transition: background 0.3s;
`;

const AvatarCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 8px auto;
`;

const AvatarImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.div`
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
  transition: color 0.3s;
`;

const Username = styled.div`
  font-size: 16px;
  color: #949CA9;
  text-align: center;
  margin-bottom: 18px;
`;

const Table = styled.div`
  width: 90%;
  max-width: 370px;
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  margin-bottom: 18px;
  overflow: hidden;
  transition: background 0.3s;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 0 18px;
  height: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 17px;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s, border-color 0.3s;
  &:last-child { border-bottom: none; }
`;

const CellTitle = styled.div`
  flex: 0 0 110px;
  font-weight: 600;
`;

const CellValue = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const ThemeSelect = styled.select`
  background: transparent;
  border: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  outline: none;
  font-weight: 400;
  appearance: none;
  padding-right: 20px;
  cursor: pointer;
  direction: ltr;
  text-align-last: left;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  
  option {
    direction: ltr;
    text-align: left;
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text};
  }
`;

const Arrow = styled.span`
  margin-left: 8px;
  display: inline-block;
  transition: transform 0.3s;
  transform: rotate(${({ open }) => (open ? -90 : 0)}deg);
  position: absolute;
  right: 0;
  pointer-events: none;
`;

const FacebookButton = styled.button`
  width: 90%;
  max-width: 370px;
  padding: 14px 0;
  background: ${({ theme }) => theme.button};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 18px;
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
  background: ${({ theme }) => theme.buttonSecondary};
  color: ${({ theme }) => theme.buttonSecondaryText};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background 0.3s, color 0.3s;
`;

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const setThemeStore = useStore((state) => state.setTheme);
  const themeStore = useStore((state) => state.theme);
  const [arrowOpen, setArrowOpen] = useState(false);
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  const handleFacebookClick = () => {
    alert('Здесь будет подключение Facebook Ads');
  };

  const handleThemeFocus = () => setArrowOpen(true);
  const handleThemeBlur = () => setArrowOpen(false);

  return (
    <Container theme={theme}>
      <AvatarCircle>
        {tgUser?.photo_url ? (
          <AvatarImg src={tgUser.photo_url} alt="avatar" />
        ) : (
          <AvatarImg src={profileGrayIcon} alt="avatar" />
        )}
      </AvatarCircle>
      <Name theme={theme}>{tgUser?.first_name || 'Имя'} {tgUser?.last_name || ''}</Name>
      <Username>@{tgUser?.username || 'username'}</Username>
      <Table theme={theme}>
        <Row theme={theme}>
          <CellTitle>Аккаунт</CellTitle>
          <CellValue>{tgUser?.username ? `@${tgUser.username}` : 'username'}</CellValue>
        </Row>
        <Row theme={theme} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/tariffs'}>
          <CellTitle>Тариф</CellTitle>
          <CellValue>Нет<Arrow>&#8250;</Arrow></CellValue>
        </Row>
        <Row theme={theme}>
          <CellTitle>Тема</CellTitle>
          <CellValue>
            <ThemeSelect
              value={themeStore}
              onChange={e => { setTheme(e.target.value); setThemeStore(e.target.value); }}
              onFocus={handleThemeFocus}
              onBlur={handleThemeBlur}
              theme={theme}
            >
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
            </ThemeSelect>
            <Arrow open={arrowOpen}>&#8250;</Arrow>
          </CellValue>
        </Row>
      </Table>
      <FacebookButton theme={theme} onClick={handleFacebookClick}>
        <img src={facebookIcon} alt="Facebook" width={22} height={22} />
        Подключить Facebook Ads Account
      </FacebookButton>
      <ExitButton theme={theme}>Выйти</ExitButton>
    </Container>
  );
};

export default Profile; 
