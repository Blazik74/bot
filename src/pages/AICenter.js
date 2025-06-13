import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import targetologIcon from '../assets/icons/targetolog.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 100px 0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 48px 0 24px 0;
  color: #181A1B;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #E5E8EB;
  margin-bottom: 24px;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0 16px;
`;

const Card = styled.div`
  background: #fff;
  border: 2px solid #E5E8EB;
  border-radius: 16px;
  padding: 18px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: ${({active}) => active ? 'pointer' : 'default'};
  opacity: ${({active}) => active ? 1 : 0.6};
  position: relative;
`;

const CardIcon = styled.div`
  width: 40px;
  height: 40px;
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
  font-size: 20px;
  font-weight: 500;
  color: #181A1B;
`;

const Soon = styled.span`
  font-size: 13px;
  color: #BDBDBD;
  font-weight: 400;
  position: absolute;
  right: 18px;
`;

const TariffButton = styled.button`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 64px;
  margin: 0 auto;
  width: 220px;
  background: none;
  border: none;
  color: #005EFF;
  font-size: 17px;
  font-weight: 500;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
  z-index: 10;
`;

const AICenter = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>ИИ Центр</Title>
      <Divider />
      <CardList>
        <Card active onClick={() => navigate('/targetolog')}>
          <CardIcon><img src={targetologIcon} alt="ИИ Таргетолог" /></CardIcon>
          <CardLabel>ИИ Таргетолог</CardLabel>
        </Card>
        <Card>
          <CardIcon><img src={buhgalterIcon} alt="ИИ Бухгалтер" /></CardIcon>
          <CardLabel>ИИ Бухгалтер</CardLabel>
          <Soon>будет скоро</Soon>
        </Card>
        <Card>
          <CardIcon><img src={sellerIcon} alt="ИИ Продавец" /></CardIcon>
          <CardLabel>ИИ Продавец</CardLabel>
          <Soon>будет скоро</Soon>
        </Card>
        <Card>
          <CardIcon><img src={consultantIcon} alt="ИИ Консультант" /></CardIcon>
          <CardLabel>ИИ Консультант</CardLabel>
          <Soon>будет скоро</Soon>
        </Card>
      </CardList>
      <TariffButton onClick={() => navigate('/tariffs')}>Тарифы и оплата</TariffButton>
    </Container>
  );
};

export default AICenter; 
