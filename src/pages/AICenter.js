import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import targetologIcon from '../assets/icons/targetolog.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 100px 0;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 48px 0 24px 0;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #E5E8EB;
  margin-bottom: 24px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 16px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#fff'};
  border: 2px solid #E5E8EB;
  border-radius: 20px;
  padding: 28px 20px 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 90px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  cursor: ${({active}) => active ? 'pointer' : 'default'};
  opacity: ${({active}) => active ? 1 : 0.7};
  position: relative;
  transition: background 0.3s;
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
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
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const Soon = styled.span`
  font-size: 15px;
  color: #FFD600;
  font-weight: 500;
  margin-left: 4px;
  margin-top: 4px;
`;

const TariffText = styled.div`
  margin: 32px 0 0 0;
  text-align: center;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  font-size: 18px;
  font-weight: 500;
`;

const AICenter = () => {
  const navigate = useNavigate();
  const theme = useTheme().theme || 'light';
  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Центр</Title>
      <Divider />
      <CardList>
        <Card theme={theme} active onClick={() => navigate('/targetolog')}>
          <CardRow>
            <CardIcon><img src={targetologIcon} alt="ИИ Таргетолог" /></CardIcon>
            <CardLabel theme={theme}>ИИ Таргетолог</CardLabel>
          </CardRow>
        </Card>
        <Card theme={theme}>
          <CardRow>
            <CardIcon><img src={buhgalterIcon} alt="ИИ Бухгалтер" /></CardIcon>
            <CardLabel theme={theme}>ИИ Бухгалтер</CardLabel>
          </CardRow>
          <Soon>будет скоро</Soon>
        </Card>
        <Card theme={theme}>
          <CardRow>
            <CardIcon><img src={sellerIcon} alt="ИИ Продавец" /></CardIcon>
            <CardLabel theme={theme}>ИИ Продавец</CardLabel>
          </CardRow>
          <Soon>будет скоро</Soon>
        </Card>
        <Card theme={theme}>
          <CardRow>
            <CardIcon><img src={consultantIcon} alt="ИИ Консультант" /></CardIcon>
            <CardLabel theme={theme}>ИИ Консультант</CardLabel>
          </CardRow>
          <Soon>будет скоро</Soon>
        </Card>
      </CardList>
      <TariffText theme={theme}>Тарифы и оплата</TariffText>
    </Container>
  );
};

export default AICenter; 
