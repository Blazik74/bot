import React from 'react';
import styled from 'styled-components';
import { useThemeContext } from '../contexts/ThemeContext';
import BottomNav from '../components/BottomNav';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  transition: background 0.3s;
`;

const Title = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
  transition: color 0.3s;
`;

const PaymentText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  text-align: center;
  margin-bottom: 20px;
  transition: color 0.3s;
`;

const Home = () => {
  const { theme } = useThemeContext();

  return (
    <Container theme={theme}>
      <Title theme={theme}>Добро пожаловать</Title>
      <PaymentText theme={theme}>
        Для продолжения работы оплатите подписку и подключите счета.<br/>
        Перейдите в раздел "Тарифы и оплата" для активации.
      </PaymentText>
      <BottomNav />
    </Container>
  );
};

export default Home; 