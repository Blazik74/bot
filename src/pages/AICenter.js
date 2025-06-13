import React from 'react';
import styled, { useTheme } from 'styled-components';
import targetologistBlueIcon from '../assets/icons/targetologist-blue.svg';
import consultantIcon from '../assets/icons/consultant.svg';
import sellerIcon from '../assets/icons/seller.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  padding: 32px 16px 100px 16px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #E5E8EB;
  margin-bottom: 24px;
`;

const Models = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const ModelTab = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme === 'dark' ? '#23272A' : '#F6F6F6'};
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: none;
  border: none;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const ModelIcon = styled.img`
  width: 44px;
  height: 44px;
  margin-right: 18px;
`;

const ModelText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
  display: flex;
  align-items: center;
`;

const Soon = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #8A8A8A;
  background: #F0F0F0;
  border-radius: 8px;
  padding: 2px 10px;
  margin-left: 12px;
`;

const TariffButton = styled.a`
  display: block;
  margin: 0 auto 0 auto;
  width: 220px;
  text-align: center;
  background: #005EFF;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  border-radius: 12px;
  padding: 14px 0;
  text-decoration: none;
  box-shadow: none;
  border: none;
  cursor: pointer;
`;

const AICenter = () => {
  const theme = useTheme().theme || 'light';
  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Центр</Title>
      <Divider />
      <Models>
        <ModelTab theme={theme}>
          <ModelIcon src={targetologistBlueIcon} alt="ИИ Таргетолог" />
          <ModelText theme={theme}>ИИ Таргетолог</ModelText>
        </ModelTab>
        <ModelTab theme={theme} disabled>
          <ModelIcon src={buhgalterIcon} alt="ИИ Бухгалтер" />
          <ModelText theme={theme}>ИИ Бухгалтер <Soon>Скоро будет</Soon></ModelText>
        </ModelTab>
        <ModelTab theme={theme} disabled>
          <ModelIcon src={sellerIcon} alt="ИИ Продавец" />
          <ModelText theme={theme}>ИИ Продавец <Soon>Скоро будет</Soon></ModelText>
        </ModelTab>
        <ModelTab theme={theme} disabled>
          <ModelIcon src={consultantIcon} alt="ИИ Консультант" />
          <ModelText theme={theme}>ИИ Консультант <Soon>Скоро будет</Soon></ModelText>
        </ModelTab>
      </Models>
      <TariffButton href="/tariffs">Тарифы и оплата</TariffButton>
    </Container>
  );
};

export default AICenter; 
