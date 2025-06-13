import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
// Импорт SVG-иконок
import targetologIcon from '../assets/icons/targetolog.svg';
import consultantIcon from '../assets/icons/consultant.svg';
import sellerIcon from '../assets/icons/seller.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 32px 16px;
  transition: background 0.3s;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: background 0.3s;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const CardLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  transition: color 0.3s;
`;

const Soon = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #1BC47D;
  margin-left: 12px;
`;

const AICenter = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Центр</Title>
      <Cards>
        <Card theme={theme} onClick={() => navigate('/targetolog')}>
          <CardIcon><img src={targetologIcon} alt="ИИ Таргетолог" /></CardIcon>
          <CardLabel theme={theme}>ИИ Таргетолог</CardLabel>
        </Card>
        <Card theme={theme}>
          <CardIcon><img src={consultantIcon} alt="ИИ Консультант" /></CardIcon>
          <CardLabel theme={theme}>ИИ Консультант <Soon>Скоро будет</Soon></CardLabel>
        </Card>
        <Card theme={theme}>
          <CardIcon><img src={sellerIcon} alt="ИИ Продавец" /></CardIcon>
          <CardLabel theme={theme}>ИИ Продавец <Soon>Скоро будет</Soon></CardLabel>
        </Card>
        <Card theme={theme}>
          <CardIcon><img src={buhgalterIcon} alt="ИИ Бухгалтер" /></CardIcon>
          <CardLabel theme={theme}>ИИ Бухгалтер <Soon>Скоро будет</Soon></CardLabel>
        </Card>
      </Cards>
    </Container>
  );
};

export default AICenter; 
