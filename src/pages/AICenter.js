import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import targetologIcon from '../assets/icons/targetolog.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';
import targetologActiveIcon from '../assets/icons/targetolog-active.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 12px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 2px solid ${({ theme }) => theme.border};
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
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.primary};
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  padding: 12px 0;
  background-color: ${({ theme }) => theme.card};
  box-shadow: 0 1px 4px 0 rgba(0,94,255,0.04);
`;

const BlueCard = styled(Card)`
  background: #EAF1FF;
  border: 2px solid #005EFF;
  color: #005EFF;
`;

const BlueCardLabel = styled(CardLabel)`
  color: #005EFF;
`;

const DividerLine = styled.div`
  width: 100%;
  height: 2px;
  background: ${({ theme }) => theme.border};
  margin: 0 0 18px 0;
`;

export default function AICenter() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const themeObj = themes[theme];
  return (
    <Container theme={themeObj}>
      <Title theme={themeObj}>ИИ Центр</Title>
      <DividerLine theme={themeObj} />
      <CardList>
        <BlueCard theme={themeObj} active onClick={() => navigate('/targetolog')}>
          <CardRow>
            <CardIcon><img src={targetologActiveIcon} alt="ИИ Таргетолог" /></CardIcon>
            <BlueCardLabel theme={themeObj}>ИИ Таргетолог</BlueCardLabel>
          </CardRow>
        </BlueCard>
        <Card theme={themeObj}>
          <CardRow>
            <CardIcon><img src={buhgalterIcon} alt="ИИ Бухгалтер" /></CardIcon>
            <CardLabel theme={themeObj}>ИИ Бухгалтер</CardLabel>
          </CardRow>
          <Soon>Будет скоро</Soon>
        </Card>
        <Card theme={themeObj}>
          <CardRow>
            <CardIcon><img src={sellerIcon} alt="ИИ Продавец" /></CardIcon>
            <CardLabel theme={themeObj}>ИИ Продавец</CardLabel>
          </CardRow>
          <Soon>Будет скоро</Soon>
        </Card>
        <Card theme={themeObj}>
          <CardRow>
            <CardIcon><img src={consultantIcon} alt="ИИ Консультант" /></CardIcon>
            <CardLabel theme={themeObj}>ИИ Консультант</CardLabel>
          </CardRow>
          <Soon>Будет скоро</Soon>
        </Card>
      </CardList>
      <TariffButton theme={themeObj} onClick={() => navigate('/tariffs')}>Тарифы и оплата</TariffButton>
    </Container>
  );
} 
