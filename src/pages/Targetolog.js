import React, { useState, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import fileIcon from '../assets/icons/file-upload.svg';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';

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
  text-align: center;
  margin: 36px 0 0 0;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #E5E8EB;
  margin: 18px 0 24px 0;
`;

const UploadBlock = styled.div`
  background: #F6F8FA;
  border-radius: 12px;
  margin: 0 16px 18px 16px;
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 16px;
  color: #181A1B;
  cursor: pointer;
  flex: 1;
`;

const UploadButton = styled.button`
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 18px;
  margin-left: 8px;
  cursor: pointer;
  transition: background 0.2s;
`;

const UploadSuccess = styled.div`
  color: #1BC47D;
  font-size: 15px;
  margin-top: 6px;
`;

const MainButton = styled.button`
  width: 90%;
  margin: 18px auto 0 auto;
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

const OverviewBlock = styled.div`
  background: #F6F8FA;
  border-radius: 12px;
  margin: 18px 16px 0 16px;
  padding: 14px 0 10px 0;
  display: flex;
  justify-content: space-around;
  font-size: 15px;
  color: #181A1B;
`;

const OverviewItem = styled.div`
  text-align: center;
`;

const CampaignsSection = styled.div`
  margin: 24px 16px 0 16px;
`;

const CampaignsTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #181A1B;
  margin-bottom: 12px;
`;

const CampaignList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CampaignCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 16px 14px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 2px solid #E5E8EB;
`;

const CampaignHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CampaignName = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #181A1B;
`;

const CampaignStatus = styled.div`
  font-size: 14px;
  color: ${({ active }) => active ? '#1BC47D' : '#F44336'};
  font-weight: 600;
`;

const CampaignAction = styled.button`
  background: ${({ active }) => active ? '#F44336' : '#005EFF'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  margin-left: 12px;
`;

const CampaignStats = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 8px;
  font-size: 14px;
  color: #181A1B;
`;

const AdviceSection = styled.div`
  margin: 32px 16px 0 16px;
`;

const AdviceTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #181A1B;
  margin-bottom: 8px;
`;

const AdviceBox = styled.div`
  background: #F6F8FA;
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  color: #181A1B;
  min-height: 60px;
`;

const AutopilotSection = styled.div`
  margin: 32px 16px 0 16px;
`;

const AutopilotTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #181A1B;
  margin-bottom: 8px;
`;

const AutopilotButton = styled.button`
  background: ${({ enabled }) => enabled ? '#F44336' : '#1BC47D'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 0;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
`;

const HistoryList = styled.div`
  margin-top: 12px;
`;

const HistoryItem = styled.div`
  font-size: 14px;
  color: #181A1B;
  margin-bottom: 6px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWindow = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 32px 18px 24px 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
`;

const ModalTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #181A1B;
`;

const ModalText = styled.div`
  font-size: 16px;
  color: #181A1B;
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 0;
  width: 100%;
  margin-top: 18px;
  cursor: pointer;
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
