import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import fileIcon from '../assets/icons/file-upload.svg';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 80px;
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

const CampaignsSection = styled.div`
  margin: 0 16px 24px 16px;
`;

const CampaignTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  margin-bottom: 12px;
`;

const CampaignList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CampaignCard = styled.div`
  background: ${({ theme }) => theme === 'dark' ? '#23272F' : '#fff'};
  border-radius: 14px;
  padding: 16px 14px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CampaignName = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const CampaignStatus = styled.div`
  font-size: 14px;
  color: #888;
`;

const Targetolog = () => {
  const theme = useTheme().theme || 'light';
  const [showFrame7, setShowFrame7] = useState(false);
  const [campaigns] = useState([
    { name: 'Летняя распродажа', status: 'Активна' },
    { name: 'Новая коллекция', status: 'Пауза' },
  ]);

  if (showFrame7) {
    return (
      <Container theme={theme}>
        <Title theme={theme}>Кампания запущена!</Title>
        {/* Здесь будет Frame 7 */}
      </Container>
    );
  }

  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Таргетолог</Title>
      <Subtitle>Создайте рекламную кампанию за 2 минуты</Subtitle>
      <Card theme={theme}>
        <Input theme={theme} placeholder="Название кампании" />
        <Input theme={theme} placeholder="Ссылка на сайт или продукт" />
        <FileUpload>
          <FileIcon src={fileIcon} alt="Выбрать файл" />
          <span>Выбрать файл</span>
        </FileUpload>
      </Card>
      <Button onClick={() => setShowFrame7(true)}>Запустить кампанию</Button>
      <CampaignsSection>
        <CampaignTitle theme={theme}>Ваши кампании</CampaignTitle>
        <CampaignList>
          {campaigns.map((c, i) => (
            <CampaignCard theme={theme} key={i}>
              <CampaignName theme={theme}>{c.name}</CampaignName>
              <CampaignStatus>{c.status}</CampaignStatus>
            </CampaignCard>
          ))}
        </CampaignList>
      </CampaignsSection>
    </Container>
  );
};

export default Targetolog;
