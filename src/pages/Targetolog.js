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

const initialCampaigns = [
  {
    id: 1,
    name: 'Кампания 1',
    status: 'active',
    stats: { clicks: 11, impressions: 11, ctr: 11, cpc: 11, cpm: 11 },
  },
  {
    id: 2,
    name: 'Кампания 2',
    status: 'paused',
    stats: { clicks: 11, impressions: 11, ctr: 11, cpc: 11, cpm: 11 },
  },
];

const initialAdvice = [
  'Совет 1 от ИИ',
  'Совет 2 от ИИ',
];

const initialHistory = [
  { text: 'Автопилот включён', time: '1ч. назад' },
  { text: 'Кампания запущена', time: '2ч. назад' },
];

export default function Targetolog() {
  const theme = useTheme().theme || 'light';
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalText, setUploadModalText] = useState('');
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionModalText, setActionModalText] = useState('');
  const [advice, setAdvice] = useState(initialAdvice);
  const [autopilot, setAutopilot] = useState(true);
  const [history, setHistory] = useState(initialHistory);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignGoal, setCampaignGoal] = useState('conversion');
  const [geo, setGeo] = useState('Казахстан, Россия');
  const [allCountry, setAllCountry] = useState(false);
  const [budget, setBudget] = useState('1');
  const [date, setDate] = useState('Сегодня');
  const [time, setTime] = useState('12:00');
  const [modalType, setModalType] = useState('success'); // success, error, info

  // File upload logic
  const fileInputRef = useRef();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileUploaded(false);
  };
  const handleUpload = () => {
    if (file) {
      setShowUploadModal(true);
      setUploadModalText('Креатив загружен успешно');
      setFileUploaded(true);
    } else {
      setShowUploadModal(true);
      setUploadModalText('Ошибка при загрузке');
      setFileUploaded(false);
    }
  };

  // Campaign actions
  const handleCampaignAction = (id, action) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: action === 'start' ? 'active' : 'paused' }
          : c
      )
    );
    setShowActionModal(true);
    setActionModalText(
      action === 'start' ? 'Автопилот включён' : 'Кампания остановлена'
    );
  };

  // Autopilot toggle
  const handleAutopilot = () => {
    setAutopilot((prev) => !prev);
    setShowActionModal(true);
    setActionModalText(autopilot ? 'Автопилот выключен' : 'Автопилот включён');
  };

  // Campaign modal (Frame 7)
  const handleCreateCampaign = () => {
    setShowCampaignModal(false);
    setShowActionModal(true);
    setActionModalText('Кампания создана');
  };

  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Таргетолог</Title>
      <Divider />
      {/* Загрузка креатива */}
      <UploadBlock>
        <FileInputRow>
          <FileInput
            ref={fileInputRef}
            type="file"
            id="creative-upload"
            onChange={handleFileChange}
          />
          <FileLabel htmlFor="creative-upload">
            <img src={fileIcon} alt="file" width={22} height={22} />
            {file ? file.name : 'Выбрать файл'}
          </FileLabel>
          {file && (
            <UploadButton onClick={handleUpload}>Загрузить</UploadButton>
          )}
        </FileInputRow>
        {fileUploaded && <UploadSuccess>Файл успешно загружен</UploadSuccess>}
      </UploadBlock>
      <MainButton onClick={() => setShowCampaignModal(true)}>
        Запустить кампанию
      </MainButton>
      {/* Обзор показателей */}
      <OverviewBlock>
        <OverviewItem>
          <div>Показы</div>
          <div>11</div>
        </OverviewItem>
        <OverviewItem>
          <div>CTR</div>
          <div>11</div>
        </OverviewItem>
        <OverviewItem>
          <div>CPC</div>
          <div>11</div>
        </OverviewItem>
      </OverviewBlock>
      {/* Список кампаний */}
      <CampaignsSection>
        <CampaignsTitle>Список рекламных кампаний</CampaignsTitle>
        <CampaignList>
          {campaigns.map((c) => (
            <CampaignCard key={c.id}>
              <CampaignHeader>
                <div>
                  <CampaignName>{c.name}</CampaignName>
                  <CampaignStatus active={c.status === 'active'}>
                    {c.status === 'active' ? 'Активна' : 'Приостановлена'}
                  </CampaignStatus>
                </div>
                <CampaignAction
                  active={c.status === 'active'}
                  onClick={() =>
                    handleCampaignAction(c.id, c.status === 'active' ? 'stop' : 'start')
                  }
                >
                  {c.status === 'active' ? 'Остановить' : 'Запустить'}
                </CampaignAction>
              </CampaignHeader>
              <CampaignStats>
                <div>Клики<br />{c.stats.clicks}</div>
                <div>Показы<br />{c.stats.impressions}</div>
                <div>CTR<br />{c.stats.ctr}</div>
                <div>CPC<br />{c.stats.cpc}</div>
                <div>CPM<br />{c.stats.cpm}</div>
              </CampaignStats>
            </CampaignCard>
          ))}
        </CampaignList>
      </CampaignsSection>
      {/* Советы от ИИ */}
      <AdviceSection>
        <AdviceTitle>Советы от ИИ</AdviceTitle>
        {advice.length > 0 && (
          <AdviceBox>{advice.join('\n')}</AdviceBox>
        )}
      </AdviceSection>
      {/* Автопилот */}
      <AutopilotSection>
        <AutopilotTitle>ИИ-автопилот</AutopilotTitle>
        <AutopilotButton enabled={autopilot} onClick={handleAutopilot}>
          {autopilot ? 'Выключить' : 'Включить'}
        </AutopilotButton>
        <HistoryList>
          {history.map((h, i) => (
            <HistoryItem key={i}>• {h.text} <span style={{ color: '#888' }}>{h.time}</span></HistoryItem>
          ))}
        </HistoryList>
      </AutopilotSection>
      {/* Модальные окна */}
      {showUploadModal && (
        <ModalOverlay onClick={() => setShowUploadModal(false)}>
          <ModalWindow onClick={e => e.stopPropagation()}>
            <ModalTitle>{uploadModalText.includes('ошибка') ? 'Ошибка при загрузке' : 'Креатив загружен успешно'}</ModalTitle>
            <ModalText>{uploadModalText}</ModalText>
            <ModalButton onClick={() => setShowUploadModal(false)}>Ok</ModalButton>
          </ModalWindow>
        </ModalOverlay>
      )}
      {showActionModal && (
        <ModalOverlay onClick={() => setShowActionModal(false)}>
          <ModalWindow onClick={e => e.stopPropagation()}>
            <ModalTitle>{actionModalText}</ModalTitle>
            <ModalButton onClick={() => setShowActionModal(false)}>Ok</ModalButton>
          </ModalWindow>
        </ModalOverlay>
      )}
      {/* Модальное окно создания кампании (Frame 7) */}
      {showCampaignModal && (
        <ModalOverlay onClick={() => setShowCampaignModal(false)}>
          <ModalWindow onClick={e => e.stopPropagation()}>
            <ModalTitle>Цель кампании</ModalTitle>
            <div style={{ marginBottom: 12, fontWeight: 500 }}>Что вы хотите получить?</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <ModalButton style={{ background: campaignGoal === 'conversion' ? '#005EFF' : '#E5E8EB', color: campaignGoal === 'conversion' ? '#fff' : '#181A1B', flex: 1 }} onClick={() => setCampaignGoal('conversion')}>Конверсия</ModalButton>
              <ModalButton style={{ background: campaignGoal === 'site' ? '#005EFF' : '#E5E8EB', color: campaignGoal === 'site' ? '#fff' : '#181A1B', flex: 1 }} onClick={() => setCampaignGoal('site')}>Посещения сайта</ModalButton>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <ModalButton style={{ background: campaignGoal === 'leads' ? '#005EFF' : '#E5E8EB', color: campaignGoal === 'leads' ? '#fff' : '#181A1B', flex: 1 }} onClick={() => setCampaignGoal('leads')}>Лиды</ModalButton>
              <ModalButton style={{ background: campaignGoal === 'engagement' ? '#005EFF' : '#E5E8EB', color: campaignGoal === 'engagement' ? '#fff' : '#181A1B', flex: 1 }} onClick={() => setCampaignGoal('engagement')}>Вовлеченность</ModalButton>
            </div>
            <div style={{ fontWeight: 700, margin: '18px 0 6px 0' }}>Геолокация аудитории</div>
            <input style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #D1D5DB', marginBottom: 8 }} value={geo} onChange={e => setGeo(e.target.value)} disabled={allCountry} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <input type="checkbox" checked={allCountry} onChange={e => setAllCountry(e.target.checked)} />
              <span style={{ marginLeft: 8 }}>Вся страна</span>
            </div>
            <div style={{ fontWeight: 700, margin: '18px 0 6px 0' }}>Дневной бюджет</div>
            <input style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #D1D5DB', marginBottom: 8 }} type="number" min={1} value={budget} onChange={e => setBudget(e.target.value)} />
            <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Минимум $1</div>
            <div style={{ fontWeight: 700, margin: '18px 0 6px 0' }}>Время публикации</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <select value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #D1D5DB' }}>
                <option>Сегодня</option>
                <option>Завтра</option>
              </select>
              <select value={time} onChange={e => setTime(e.target.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #D1D5DB' }}>
                <option>12:00</option>
                <option>18:00</option>
                <option>21:00</option>
              </select>
            </div>
            <ModalButton onClick={handleCreateCampaign}>Запустить кампанию</ModalButton>
            <div style={{ position: 'absolute', top: 18, right: 18, cursor: 'pointer', fontSize: 28, color: '#B84D8B' }} onClick={() => setShowCampaignModal(false)}>&#10005;</div>
          </ModalWindow>
        </ModalOverlay>
      )}
    </Container>
  );
} 
