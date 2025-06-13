import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import targetologBlueIcon from '../assets/icons/targetolog-blue.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 32px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 2px solid #E5E8EB;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    border-color: #005EFF;
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #222;
`;

const CardDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const CardButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #0046CC;
  }
`;

const AICenter = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>ИИ Центр</Title>
      <Card>
        <CardTitle>ИИ Таргетолог</CardTitle>
        <CardDescription>Автоматизация и оптимизация рекламных кампаний с помощью искусственного интеллекта.</CardDescription>
        <CardButton>Начать работу</CardButton>
      </Card>
      <Card>
        <CardTitle>ИИ Консультант</CardTitle>
        <CardDescription>Скоро будет</CardDescription>
      </Card>
      <Card>
        <CardTitle>ИИ Продавец</CardTitle>
        <CardDescription>Скоро будет</CardDescription>
      </Card>
      <Card>
        <CardTitle>ИИ Бухгалтер</CardTitle>
        <CardDescription>Скоро будет</CardDescription>
      </Card>
    </Container>
  );
};

export default AICenter; 
