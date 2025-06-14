import React from 'react';
import styled, { useTheme } from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  padding: 0 0 80px 0;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: left;
  margin: 36px 0 18px 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const Subtitle = styled.div`
  font-size: 16px;
  color: #888;
  margin: 0 0 18px 16px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#F6F8FA'};
  border-radius: 16px;
  margin: 0 16px 18px 16px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  border: 1px solid #E5E8EB;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#fff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const FileUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const FileIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const Button = styled.button`
  width: 90%;
  margin: 24px auto 0 auto;
  display: block;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 0;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
`;

const Targetolog = () => {
  const theme = useTheme().theme || 'light';
  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Таргетолог</Title>
      <Subtitle>Создайте рекламную кампанию за 2 минуты</Subtitle>
      <Card theme={theme}>
        <Input theme={theme} placeholder="Название кампании" />
        <Input theme={theme} placeholder="Ссылка на сайт или продукт" />
        <FileUpload>
          <FileIcon src={require('../assets/icons/file-upload.svg').default} alt="Выбрать файл" />
          <span>Выбрать файл</span>
        </FileUpload>
      </Card>
      <Button>Запустить кампанию</Button>
    </Container>
  );
};

export default Targetolog; 
