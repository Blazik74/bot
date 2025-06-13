import React from 'react';
import styled, { useTheme } from 'styled-components';
import useStore from '../store';
import profileGrayIcon from '../assets/icons/profile-gray.svg';
import facebookIcon from '../assets/icons/facebook.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 32px 0;
`;

const AvatarCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 16px auto;
`;

const AvatarImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
`;

const Username = styled.div`
  font-size: 26px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
`;

const Table = styled.div`
  width: 90%;
  max-width: 370px;
  background: ${({ theme }) => theme === 'dark' ? '#23272A' : '#E0E0E0'};
  border-radius: 12px;
  margin-bottom: 18px;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 0 18px;
  height: 48px;
  border-bottom: 1px solid #D1D5DB;
  font-size: 17px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
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
`;

const Arrow = styled.span`
  margin-left: 8px;
  color: #949CA9;
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
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ExitButton = styled.button`
  width: 90%;
  max-width: 370px;
  padding: 14px 0;
  background: #E0E0E0;
  color: #005EFF;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
`;

const Profile = () => {
  const user = useStore((state) => state.user) || { username: 'User', avatar: '', tariff: null };
  const setTheme = useStore((state) => state.setTheme);
  const themeStore = useStore((state) => state.theme);
  const theme = useTheme().theme || themeStore || 'light';

  return (
    <Container theme={theme}>
      <AvatarCircle>
        {user.avatar ? (
          <AvatarImg src={user.avatar} alt="avatar" />
        ) : (
          <img src={profileGrayIcon} alt="avatar" width={90} height={90} />
        )}
      </AvatarCircle>
      <Username theme={theme}>{user.username || 'Имя пользователя'}</Username>
      <Table theme={theme}>
        <Row theme={theme}>
          <CellTitle>Аккаунт</CellTitle>
          <CellValue>{user.username || 'Имя пользователя'}</CellValue>
        </Row>
        <Row theme={theme} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/tariffs'}>
          <CellTitle>Тариф</CellTitle>
          <CellValue>{user.tariff === 'company' ? 'Компания' : user.tariff === 'freelancer' ? 'Фрилансер' : 'Нет'}<Arrow>&#8250;</Arrow></CellValue>
        </Row>
        <Row theme={theme}>
          <CellTitle>Тема</CellTitle>
          <CellValue>
            <select
              value={themeStore}
              onChange={e => setTheme(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                color: theme === 'dark' ? '#fff' : '#222',
                outline: 'none',
                fontWeight: 400
              }}
            >
              <option value="light">Светлая</option>
              <option value="dark">Темная</option>
            </select>
            <Arrow>&#8250;</Arrow>
          </CellValue>
        </Row>
      </Table>
      <FacebookButton>
        <img src={facebookIcon} alt="Facebook" width={22} height={22} />
        Подключить Facebook Ads Account
      </FacebookButton>
      <ExitButton>Выйти</ExitButton>
    </Container>
  );
};

export default Profile; 
