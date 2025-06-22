import React from 'react';
import styled from 'styled-components';
// import { ReactComponent as LockIcon } from '../assets/icons/lock.svg'; // Убираем этот импорт, так как файла нет

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px); // Высота экрана минус высота BottomNav
  text-align: center;
  padding: 20px;
  background-color: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f0f2f5;
  margin-bottom: 24px;

  svg {
    width: 48px;
    height: 48px;
    fill: #818c99;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #818c99;
  max-width: 300px;
  line-height: 1.5;
`;

const Button = styled.button`
  margin-top: 32px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const AccessDeniedPage = () => {
    // Можно добавить логику для кнопки, например, связаться с админом
    const handleRequestAccess = () => {
        // Например, открыть ссылку на Telegram-бота
        window.open('https://t.me/YOUR_BOT_USERNAME', '_blank');
    };

  return (
    <Container>
      <IconWrapper>
        {/* Вместо иконки замка можно использовать любую другую */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v3H9V7c0-1.654 1.346-3 3-3z"></path></svg>
      </IconWrapper>
      <Title>Доступ к приложению</Title>
      <Subtitle>
        Для использования сервиса ваш Telegram-аккаунт должен быть авторизован
      </Subtitle>
      <Button onClick={handleRequestAccess}>Запросить доступ</Button>
    </Container>
  );
};

export default AccessDeniedPage; 
