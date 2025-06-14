import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import targetologIcon from '../assets/icons/targetolog.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';
import targetologActiveIcon from '../assets/icons/targetolog-active.svg';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 36px 0 18px 0;
  color: #181A1B;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 12px;
`;

const Card = styled.div`
  background: #fff;
  border: 2px solid #E5E8EB;
  border-radius: 20px;
  padding: 18px 20px 14px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 72px;
  max-height: 90px;
  box-sizing: border-box;
  cursor: ${({active}) => active ? 'pointer' : 'default'};
  opacity: ${({active}) => active ? 1 : 0.7};
  position: relative;
  transition: background 0.3s;
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
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
  font-size: 19px;
  font-weight: 600;
  color: #181A1B;
`;

const Soon = styled.span`
  font-size: 15px;
  color: #FFD600;
  font-weight: 500;
  margin-left: 2px;
  margin-top: 4px;
`;

const TariffButton = styled.button`
  margin: 22px 16px 0 16px;
  width: calc(100% - 32px);
  background: none;
  border: none;
  color: #005EFF;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  padding: 12px 0;
  background-color: ${({ theme }) => theme === 'dark' ? '#23272F' : '#EAF1FF'};
  box-shadow: 0 1px 4px 0 rgba(0,94,255,0.04);
`;

const BlueCard = styled(Card)`
  background: #EAF1FF;
  border: 2px solid #005EFF;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
`;

const BlueCardRow = styled(CardRow)`
  color: #005EFF;
`;

const BlueCardIcon = styled(CardIcon)`
  img {
    filter: none;
  }
`;

const BlueCardLabel = styled(CardLabel)`
  color: #005EFF;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #E5E8EB;
  margin: 18px 0 24px 0;
`;

const AICenter = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Title>ИИ Центр</Title>
      <Divider />
      <CardList>
        <BlueCard active onClick={() => navigate('/targetolog')}>
          <BlueCardRow>
            <BlueCardIcon><img src={targetologActiveIcon} alt="ИИ Таргетолог" /></BlueCardIcon>
            <BlueCardLabel>ИИ Таргетолог</BlueCardLabel>
          </BlueCardRow>
        </BlueCard>
        <Card>
          <CardRow>
            <CardIcon><img src={buhgalterIcon} alt="ИИ Бухгалтер" /></CardIcon>
            <CardLabel>ИИ Бухгалтер</CardLabel>
          </CardRow>
          <Soon>Будет скоро</Soon>
        </Card>
        <Card>
          <CardRow>
            <CardIcon><img src={sellerIcon} alt="ИИ Продавец" /></CardIcon>
            <CardLabel>ИИ Продавец</CardLabel>
          </CardRow>
          <Soon>Будет скоро</Soon>
        </Card>
        <Card>
          <CardRow>
            <CardIcon><img src={consultantIcon} alt="ИИ Консультант" /></CardIcon>
            <CardLabel>ИИ Консультант</CardLabel>
          </CardRow>
          <Soon>Будет скоро</Soon>
        </Card>
      </CardList>
      <TariffButton onClick={() => navigate('/tariffs')}>Тарифы и оплата</TariffButton>
    </Container>
  );
};

export default AICenter; 
