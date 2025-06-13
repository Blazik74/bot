import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import aiCenterIcon from '../assets/icons/ai-center.svg';
import targetologIcon from '../assets/icons/targetolog.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';

const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const TabsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }
`;

const TabIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
`;

const TabTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

const ComingSoon = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
`;

const TariffsButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const AICenter = () => {
  const navigate = useNavigate();

  const handleTargetologClick = () => {
    navigate('/targetolog');
  };

  const handleTariffsClick = () => {
    navigate('/tariffs');
  };

  return (
    <Container>
      <Header>
        <Title>ИИ Центр</Title>
      </Header>
      
      <TabsContainer>
        <Tab onClick={handleTargetologClick}>
          <TabIcon src={targetologIcon} alt="ИИ Таркетолог" />
          <TabTitle>ИИ Таркетолог</TabTitle>
        </Tab>
        
        <Tab disabled>
          <TabIcon src={buhgalterIcon} alt="ИИ Бугхалтер" />
          <TabTitle>ИИ Бугхалтер</TabTitle>
          <ComingSoon>Скоро будет</ComingSoon>
        </Tab>
        
        <Tab disabled>
          <TabIcon src={sellerIcon} alt="ИИ Продавец" />
          <TabTitle>ИИ Продавец</TabTitle>
          <ComingSoon>Скоро будет</ComingSoon>
        </Tab>
        
        <Tab disabled>
          <TabIcon src={consultantIcon} alt="ИИ Консультант" />
          <TabTitle>ИИ Консультант</TabTitle>
          <ComingSoon>Скоро будет</ComingSoon>
        </Tab>
      </TabsContainer>

      <TariffsButton onClick={handleTariffsClick}>
        Тарифы и оплата
      </TariffsButton>
    </Container>
  );
};

export default AICenter; 
