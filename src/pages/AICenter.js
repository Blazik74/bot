import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import targetologBlueIcon from '../assets/icons/targetolog-blue.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';

const Container = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px 24px 0 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-align: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #E5E8EB;
  margin-bottom: 24px;
`;

const TabsList = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

const TabRow = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 14px;
  padding: 18px 20px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  box-shadow: none;
  position: relative;
  transition: none;
`;

const TabIcon = styled.img`
  width: 36px;
  height: 36px;
  margin-right: 18px;
`;

const TabTextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TabTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
`;

const ComingSoon = styled.span`
  font-size: 13px;
  color: #FF9800;
  margin-top: 2px;
  font-weight: 500;
`;

const TariffsLink = styled.a`
  width: 100%;
  max-width: 420px;
  margin: 8px 0 0 0;
  padding: 0;
  display: block;
  text-align: center;
  background: none;
  color: #005EFF;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  border: none;
  cursor: pointer;
`;

const AICenter = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Title>ИИ Центр</Title>
        <Divider />
      </Header>
      <TabsList>
        <TabRow onClick={() => navigate('/targetolog')}>
          <TabIcon src={targetologBlueIcon} alt="ИИ Таркетолог" />
          <TabTextBlock>
            <TabTitle>ИИ Таркетолог</TabTitle>
          </TabTextBlock>
        </TabRow>
        <TabRow disabled>
          <TabIcon src={buhgalterIcon} alt="ИИ Бугхалтер" />
          <TabTextBlock>
            <TabTitle>ИИ Бугхалтер</TabTitle>
            <ComingSoon>Скоро будет</ComingSoon>
          </TabTextBlock>
        </TabRow>
        <TabRow disabled>
          <TabIcon src={sellerIcon} alt="ИИ Продавец" />
          <TabTextBlock>
            <TabTitle>ИИ Продавец</TabTitle>
            <ComingSoon>Скоро будет</ComingSoon>
          </TabTextBlock>
        </TabRow>
        <TabRow disabled>
          <TabIcon src={consultantIcon} alt="ИИ Консультант" />
          <TabTextBlock>
            <TabTitle>ИИ Консультант</TabTitle>
            <ComingSoon>Скоро будет</ComingSoon>
          </TabTextBlock>
        </TabRow>
      </TabsList>
      <TariffsLink href="#" onClick={e => {e.preventDefault();navigate('/tariffs');}}>
        Тарифы и оплата
      </TariffsLink>
    </Container>
  );
};

export default AICenter; 
