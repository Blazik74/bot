import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  padding: 24px 8px;
`;

const IconWrapper = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 16px;
`;

const List = styled.ul`
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  margin-bottom: 32px;
  padding-left: 18px;
  text-align: left;
`;

const Button = styled.button`
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  width: 100%;
  max-width: 340px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
`;

const FacebookConnect = () => {
  const { theme } = useTheme();
  return (
    <Container theme={theme}>
      <IconWrapper>
        <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40.1218" cy="40.1268" r="40" fill="#005EFF"/>
          <path d="M26.7769 27.6932C28.3905 27.2609 35.3107 28.401 37.9521 27.6932C40.5936 26.9855 53.8204 21.3891 54.5814 20.6282C55.3423 19.8673 55.254 18.9323 56.3286 18.3127C57.4032 17.6931 58.8558 17.5872 59.5814 18.3127C60.307 19.0382 60.445 20.2181 60.445 20.6282C60.445 21.0383 60.445 52.4851 60.445 53.2228C60.445 53.9604 60.8263 54.5172 59.5814 55.236C58.3365 55.9547 56.7831 55.4984 56.3286 55.236C55.8741 54.9736 55.5274 54.5843 54.7414 53.2228C53.9553 51.8612 40.0455 47.1335 37.9521 45.9249C35.8588 44.7163 28.1061 46.2904 26.7418 45.9249C25.3774 45.5593 19.7441 43.3648 19.7441 37.0919C19.7441 30.819 25.1634 28.1256 26.7769 27.6932Z" fill="white"/>
          <path d="M28.9832 48.797L37.0916 48.7973C37.0916 48.7973 42.0496 56.5185 41.4003 58.9417C40.751 61.365 39.4336 61.5631 38.5899 62.0502C37.7462 62.5373 34.8422 62.6206 32.7136 62.0502C30.5849 61.4799 30.0355 59.4069 29.4773 57.3236C28.9191 55.2403 28.9832 48.797 28.9832 48.797Z" fill="white"/>
        </svg>
      </IconWrapper>
      <Title theme={theme}>Подключение рекламного аккаунта</Title>
      <Description theme={theme}>
        Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.
      </Description>
      <List theme={theme}>
        <li>Использовать ИИ автопилот</li>
        <li>Получать советы и диагностику от ИИ</li>
        <li>Просматривать метрики</li>
        <li>Загружать креативы</li>
      </List>
      <Button>Подключить рекламный аккаунт</Button>
    </Container>
  );
};

export default FacebookConnect; 