import React from 'react';
import styled, { keyframes } from 'styled-components';
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
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 36px 0 0 0;
  color: ${({ theme }) => theme.text};
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${({ theme }) => theme.border};
  margin: 18px 0 24px 0;
  width: 90%;
  align-self: center;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-bottom: 24px;
`;

const IconBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${({ active, theme }) => active ? (theme.mode === 'dark' ? 'rgba(0,94,255,0.18)' : 'rgba(0,94,255,0.08)') : (theme.mode === 'dark' ? '#23242A' : '#F5F5F5')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  transition: background 0.2s;
`;

const IconImg = styled.img`
  width: 28px;
  height: 28px;
    object-fit: contain;
`;

const IconLabel = styled.div`
  font-size: 13px;
  font-weight: ${({ active }) => active ? 700 : 400};
  color: ${({ active, theme }) => active ? theme.text : theme.mode === 'dark' ? '#555' : '#BDBDBD'};
  text-align: center;
  margin-top: 0;
  transition: color 0.2s;
`;

const TariffButton = styled.button`
  display: block;
  margin: 0 auto;
  margin-top: 8px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 32px;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.primaryHover || '#1565c0'};
  }
`;

const LoaderAnim = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const SkeletonBlock = styled.div`
  height: 120px;
  border-radius: 18px;
  background: ${({ theme }) => theme.card};
  margin: 24px 16px;
  animation: ${LoaderAnim} 1.2s infinite;
`;

export default function AICenter() {
  const navigate = useNavigate();
  const { theme } = useThemeContext();
  const themeObj = themes[theme];
  const themeMode = theme === 'dark' ? { ...themeObj, mode: 'dark' } : { ...themeObj, mode: 'light' };
  if (!user) {
    return (
      <Container theme={themeObj}>
        <SkeletonBlock theme={themeObj} />
        <SkeletonBlock theme={themeObj} />
        <SkeletonBlock theme={themeObj} />
      </Container>
    );
  }
  return (
    <Container theme={themeMode}>
      <Title theme={themeMode}>ИИ Центр</Title>
      <Divider theme={themeMode} />
      <IconRow>
        <IconBlock>
          <IconCircle active theme={themeMode}>
            <IconImg src={targetologIconActive} alt="ИИ Таргетолог" />
          </IconCircle>
          <IconLabel active theme={themeMode}>ИИ Таргетолог</IconLabel>
        </IconBlock>
        <IconBlock>
          <IconCircle theme={themeMode}>
            <IconImg src={buhgalterIcon} alt="ИИ Бухгалтер" />
          </IconCircle>
          <IconLabel theme={themeMode}>ИИ Бухгалтер</IconLabel>
        </IconBlock>
        <IconBlock>
          <IconCircle theme={themeMode}>
            <IconImg src={sellerIcon} alt="ИИ Продавец" />
          </IconCircle>
          <IconLabel theme={themeMode}>ИИ Продавец</IconLabel>
        </IconBlock>
        <IconBlock>
          <IconCircle theme={themeMode}>
            <IconImg src={consultantIcon} alt="ИИ Консультант" />
          </IconCircle>
          <IconLabel theme={themeMode}>ИИ Консультант</IconLabel>
        </IconBlock>
      </IconRow>
      <TariffButton theme={themeMode} onClick={() => navigate('/tariffs')}>Тарифы и оплата</TariffButton>
    </Container>
  );
} 
