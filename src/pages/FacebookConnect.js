import React from 'react';
import styled from 'styled-components';
import { useThemeContext } from '../contexts/ThemeContext';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  padding: 24px 8px;
`;

const BlueCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #005EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px auto;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin-bottom: 18px;
`;

const MainDescription = styled.p`
  font-size: 16px;
  color: #222;
  text-align: center;
  margin-bottom: 18px;
`;

const BulletList = styled.ul`
  color: #222;
  font-size: 16px;
  margin-bottom: 32px;
  padding-left: 0;
  text-align: left;
  list-style: none;
`;

const BulletItem = styled.li`
  position: relative;
  padding-left: 18px;
  margin-bottom: 8px;
  &:before {
    content: '';
    position: absolute;
    left: 0; top: 8px;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #222;
  }
`;

const MainButton = styled.button`
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 16px 0;
  width: 100%;
  max-width: 340px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  margin-top: 18px;
  transition: background 0.2s;
  &:hover { background: #1565c0; }
`;

const FacebookConnect = () => {
  const { theme } = useThemeContext();
  return (
    <Container style={{background:'#fff'}}>
      <BlueCircle>
        <img src={megaphoneIcon} alt="Megaphone" style={{width:44,height:44}} />
      </BlueCircle>
      <MainTitle>Подключение рекламного аккаунта</MainTitle>
      <MainDescription>
        Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.
      </MainDescription>
      <BulletList>
        <BulletItem>Использовать ИИ автопилот</BulletItem>
        <BulletItem>Получать советы и диагностику от ИИ</BulletItem>
        <BulletItem>Просматривать метрики</BulletItem>
        <BulletItem>Загружать креативы</BulletItem>
      </BulletList>
      <MainButton>Подключить рекламный аккаунт</MainButton>
    </Container>
  );
};

export default FacebookConnect; 
