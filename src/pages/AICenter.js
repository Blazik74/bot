import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import targetologIcon from '../assets/icons/targetolog.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 24px 0;
`;

const Header = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px 24px 24px 24px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const TabsList = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
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
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: ${props => props.active ? '0 4px 16px rgba(0,0,0,0.07)' : 'none'};
  position: relative;
  &:hover {
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 16px rgba(0,0,0,0.12)'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }
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

const TariffsButton = styled.button`
  width: 100%;
  max-width: 420px;
  margin-top: auto;
  padding: 18px 0;
  background: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    transform: translateY(-2px);
  }
`;

const AICenter = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Title>ИИ Центр</Title>
      </Header>
      <TabsList>
        <TabRow onClick={() => navigate('/targetolog')}>
          <TabIcon src={targetologIcon} alt="ИИ Таркетолог" />
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
      <TariffsButton onClick={() => navigate('/tariffs')}>
        Тарифы и оплата
      </TariffsButton>
    </Container>
  );
};

export default AICenter; 
