import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import targetologIconActive from '../assets/icons/targetolog-active.svg';
import buhgalterIcon from '../assets/icons/buhgalter.svg';
import sellerIcon from '../assets/icons/seller.svg';
import consultantIcon from '../assets/icons/consultant.svg';
import { useThemeContext, themes } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 0 80px 0;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin: 36px 0 0 0;
  color: #111;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #E0E0E0;
  margin: 18px 0 32px 0;
  width: 90%;
  align-self: center;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 48px;
`;

const IconBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: ${({ active }) => active ? 'rgba(0,94,255,0.08)' : '#F5F5F5'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const IconImg = styled.img`
  width: 38px;
  height: 38px;
  object-fit: contain;
`;

const IconLabel = styled.div`
  font-size: 16px;
  font-weight: ${({ active }) => active ? 700 : 400};
  color: ${({ active }) => active ? '#111' : '#BDBDBD'};
  text-align: center;
  margin-top: 0;
`;

const TariffButton = styled.button`
  display: block;
  margin: 0 auto;
  margin-top: 24px;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 18px;
  font-size: 20px;
  font-weight: 600;
  padding: 18px 44px;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
`;

export default function AICenter() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const themeObj = themes[theme];
  return (
    <Container theme={themeObj}>
      <Title>ИИ Центр</Title>
      <Divider />
      <IconRow>
        <IconBlock>
          <IconCircle active>
            <IconImg src={targetologIconActive} alt="ИИ Таргетолог" />
          </IconCircle>
          <IconLabel active>ИИ Таргетолог</IconLabel>
        </IconBlock>
        <IconBlock>
          <IconCircle>
            <IconImg src={buhgalterIcon} alt="ИИ Бухгалтер" />
          </IconCircle>
          <IconLabel>ИИ Бухгалтер</IconLabel>
        </IconBlock>
        <IconBlock>
          <IconCircle>
            <IconImg src={sellerIcon} alt="ИИ Продавец" />
          </IconCircle>
          <IconLabel>ИИ Продавец</IconLabel>
        </IconBlock>
        <IconBlock>
          <IconCircle>
            <IconImg src={consultantIcon} alt="ИИ Консультант" />
          </IconCircle>
          <IconLabel>ИИ Консультант</IconLabel>
        </IconBlock>
      </IconRow>
      <TariffButton onClick={() => navigate('/tariffs')}>Тарифы и оплата</TariffButton>
    </Container>
  );
} 
