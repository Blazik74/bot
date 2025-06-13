import React from 'react';
import styled, { useTheme } from 'styled-components';
import targetologistBlueIcon from '../assets/icons/targetologist-blue.svg';
import consultantIcon from '../assets/icons/consultant.svg';
import sellerIcon from '../assets/icons/seller.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  padding: 32px 16px;
  transition: background 0.3s;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
  transition: color 0.3s;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272A' : '#F6F6F6'};
  border-radius: 16px;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: background 0.3s;
`;

const CardIcon = styled.img`
  width: 48px;
  height: 48px;
  transition: filter 0.3s;
`;

const CardLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
  transition: color 0.3s;
`;

const Soon = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #1BC47D;
  margin-left: 12px;
`;

const AICenter = () => {
  const theme = useTheme().theme || 'light';
  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Центр</Title>
      <Cards>
        <Card theme={theme}>
          <CardIcon src={targetologistBlueIcon} alt="ИИ Таргетолог" />
          <CardLabel theme={theme}>ИИ Таргетолог</CardLabel>
        </Card>
        <Card theme={theme}>
          <CardIcon src={consultantIcon} alt="ИИ Консультант" />
          <CardLabel theme={theme}>ИИ Консультант <Soon>Скоро будет</Soon></CardLabel>
        </Card>
        <Card theme={theme}>
          <CardIcon src={sellerIcon} alt="ИИ Продавец" />
          <CardLabel theme={theme}>ИИ Продавец <Soon>Скоро будет</Soon></CardLabel>
        </Card>
        <Card theme={theme}>
          <CardIcon src={buhgalterIcon} alt="ИИ Бухгалтер" />
          <CardLabel theme={theme}>ИИ Бухгалтер <Soon>Скоро будет</Soon></CardLabel>
        </Card>
      </Cards>
    </Container>
  );
};

export default AICenter; 
