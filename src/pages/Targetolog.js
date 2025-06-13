import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px 32px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-top: 40px;
  margin-bottom: 18px;
  text-align: center;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
  padding: 32px 20px 28px 20px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-bottom: 24px;
`;

const CardTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  text-align: center;
  margin-bottom: 12px;
`;

const CardDesc = styled.p`
  font-size: 16px;
  color: #222;
  text-align: center;
  margin-bottom: 18px;
`;

const List = styled.ul`
  color: #222;
  font-size: 15px;
  margin-bottom: 32px;
  padding-left: 18px;
  text-align: left;
`;

const FileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F5F6FA;
  border: 1px solid #B8B8B8;
  border-radius: 12px;
  padding: 10px 18px;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
`;

const Targetolog = () => {
  const { theme } = useTheme();
  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Таргетолог</Title>
      <Card>
        <IconWrapper>
          <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40.1218" cy="40.1268" r="40" fill="#005EFF"/>
            <path d="M26.7769 27.6932C28.3905 27.2609 35.3107 28.401 37.9521 27.6932C40.5936 26.9855 53.8204 21.3891 54.5814 20.6282C55.3423 19.8673 55.254 18.9323 56.3286 18.3127C57.4032 17.6931 58.8558 17.5872 59.5814 18.3127C60.307 19.0382 60.445 20.2181 60.445 20.6282C60.445 21.0383 60.445 52.4851 60.445 53.2228C60.445 53.9604 60.8263 54.5172 59.5814 55.236C58.3365 55.9547 56.7831 55.4984 56.3286 55.236C55.8741 54.9736 55.5274 54.5843 54.7414 53.2228C53.9553 51.8612 40.0455 47.1335 37.9521 45.9249C35.8588 44.7163 28.1061 46.2904 26.7418 45.9249C25.3774 45.5593 19.7441 43.3648 19.7441 37.0919C19.7441 30.819 25.1634 28.1256 26.7769 27.6932Z" fill="white"/>
            <path d="M28.9832 48.797L37.0916 48.7973C37.0916 48.7973 42.0496 56.5185 41.4003 58.9417C40.751 61.365 39.4336 61.5631 38.5899 62.0502C37.7462 62.5373 34.8422 62.6206 32.7136 62.0502C30.5849 61.4799 30.0355 59.4069 29.4773 57.3236C28.9191 55.2403 28.9832 48.797 28.9832 48.797Z" fill="white"/>
          </svg>
        </IconWrapper>
        <CardTitle>Подключение рекламного аккаунта</CardTitle>
        <CardDesc>
          Подключите свой рекламный аккаунт Facebook, чтобы начать работу с ИИ-таргетологом.
        </CardDesc>
        <List>
          <li>Использовать ИИ автопилот</li>
          <li>Получать советы и диагностику от ИИ</li>
          <li>Просматривать метрики</li>
          <li>Загружать креативы</li>
        </List>
        <FileButton>
          <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 7.78271V2.28271L14.5 7.78271M2 0.782715C0.89 0.782715 0 1.67271 0 2.78271V18.7827C0 19.3131 0.210714 19.8219 0.585786 20.1969C0.960859 20.572 1.46957 20.7827 2 20.7827H14C14.5304 20.7827 15.0391 20.572 15.4142 20.1969C15.7893 19.8219 16 19.3131 16 18.7827V6.78271L10 0.782715H2Z" fill="#B8B8B8"/>
          </svg>
          Выбрать файл
        </FileButton>
      </Card>
    </Container>
  );
};

export default Targetolog; 