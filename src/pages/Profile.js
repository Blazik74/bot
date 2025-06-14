import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import facebookIcon from '../assets/icons/facebook.svg';
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
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const Username = styled.div`
  font-size: 16px;
  color: #888;
  margin-top: 4px;
`;

const TariffBlock = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#F6F8FA'};
  border-radius: 14px;
  padding: 18px 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  font-size: 16px;
  font-weight: 500;
  margin: 18px 16px 0 16px;
  cursor: default;
  text-align: center;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 24px 16px 0 16px;
`;

const StatBox = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#F6F8FA'};
  border-radius: 12px;
  padding: 18px 0;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 4px;
`;

const ThemeSwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 16px 18px 16px;
`;

const ThemeLabel = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
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
  background: #F44336;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 18px auto 0 auto;
  transition: background 0.3s, color 0.3s;
`;

const Profile = () => {
  const theme = useTheme().theme || 'light';
  const [tgUser, setTgUser] = useState(null);
  const [themeStore, setThemeStore] = useState(theme);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  const avatar = tgUser?.photo_url || profileIcon;
  const name = tgUser?.first_name || 'Имя';
  const username = tgUser?.username || 'username';

  return (
    <Container theme={theme}>
      <ProfileHeader>
        <Avatar src={avatar} alt={name} />
        <Name theme={theme}>{name}</Name>
        <Username>@{username}</Username>
      </ProfileHeader>
      <TariffBlock theme={theme}>Фрилансер (50 000₸/мес)</TariffBlock>
      <StatGrid theme={theme}>
        <StatBox theme={theme}>
          <StatValue theme={theme}>12</StatValue>
          <StatLabel>Кампаний</StatLabel>
        </StatBox>
        <StatBox theme={theme}>
          <StatValue theme={theme}>8</StatValue>
          <StatLabel>Активных</StatLabel>
        </StatBox>
        <StatBox theme={theme}>
          <StatValue theme={theme}>1 234 000₸</StatValue>
          <StatLabel>Потрачено</StatLabel>
        </StatBox>
        <StatBox theme={theme}>
          <StatValue theme={theme}>245%</StatValue>
          <StatLabel>ROI</StatLabel>
        </StatBox>
      </StatGrid>
      <ThemeSwitchRow>
        <ThemeLabel theme={theme}>Тема</ThemeLabel>
        <ThemeSelect
          value={themeStore}
          onChange={e => setThemeStore(e.target.value)}
          theme={theme}
        >
          <option value="light">Светлая</option>
          <option value="dark">Темная</option>
        </ThemeSelect>
      </ThemeSwitchRow>
      <FacebookButton theme={theme}>
        <img src={facebookIcon} alt="Facebook" width={22} height={22} />
        Подключить Facebook Ads Account
      </FacebookButton>
      <ExitButton theme={theme}>Выйти</ExitButton>
    </Container>
  );
};

export default Profile;
