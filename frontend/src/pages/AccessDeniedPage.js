import React from 'react';
import styled from 'styled-components';
import { useThemeContext, themes } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
// import { ReactComponent as LockIcon } from '../assets/icons/lock.svg'; // Убираем этот импорт, так как файла нет

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Занимаем всю высоту экрана */
  text-align: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  box-sizing: border-box; /* Учитываем padding в расчете высоты */
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.secondary};
  margin-bottom: 24px;

  svg {
    width: 48px;
    height: 48px;
    fill: ${({ theme }) => theme.hint};
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.hint};
  max-width: 300px;
  line-height: 1.5;
`;

const Button = styled.button`
  margin-top: 32px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.buttonText};
  background-color: ${({ theme }) => theme.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    filter: brightness(110%);
  }
`;

const AccessDeniedPage = () => {
  const { theme } = useThemeContext();
  const currentTheme = themes[theme] || themes.light;
  const { refetchUser, loading } = useUser();

  return (
    <Container theme={currentTheme}>
      <IconWrapper theme={currentTheme}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3z"></path></svg>
      </IconWrapper>
      <Title>Доступ к приложению</Title>
      <Subtitle theme={currentTheme}>
        Доступ к приложению запрещён. Обратитесь к администратору.
      </Subtitle>
      <Button theme={currentTheme} onClick={refetchUser} disabled={loading}>
        {loading ? 'Обновление...' : 'Обновить профиль'}
      </Button>
    </Container>
  );
};

export default AccessDeniedPage; 
