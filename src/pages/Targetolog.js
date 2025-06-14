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
  background: rgba(0,0,0,0.08);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalWindow = styled.div`
  background: #E5E8EB;
  border-radius: 16px;
  padding: 32px 18px 0 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #B71C1C;
  margin-bottom: 18px;
`;

const ModalDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #BDBDBD;
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: #005EFF;
  font-size: 20px;
  font-weight: 600;
  margin: 18px 0 18px 0;
  cursor: pointer;
`;

const CitySearchContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const CityInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#fff'};

  &:focus {
    outline: none;
    border-color: #005EFF;
  }
`;

const CitySuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#fff'};
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const CitySuggestion = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  font-size: 15px;

  &:hover {
    background: ${({ theme }) => theme === 'dark' ? '#3C3F40' : '#F6F8FA'};
  }
`;

const citiesKZ = [
  'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау', 'Кызылорда', 'Костанай', 'Петропавловск', 'Актау', 'Темиртау', 'Туркестан', 'Экибастуз', 'Талдыкорган', 'Жезказган', 'Рудный', 'Кокшетау', 'Кентау', 'Балхаш', 'Жанаозен', 'Степногорск', 'Сатпаев', 'Аксай', 'Шу', 'Сарыагаш', 'Аягоз', 'Шахтинск', 'Лисаковск', 'Щучинск', 'Арыс', 'Кульсары', 'Жаркент', 'Каратау', 'Шардара', 'Сергеевка', 'Капшагай', 'Житикара', 'Каскелен', 'Текели', 'Форт-Шевченко', 'Арал', 'Абай', 'Байконур', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каражал', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз'];

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

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#fff'};

  &:focus {
    outline: none;
    border-color: #005EFF;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#fff'};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #005EFF;
  }
`;

const FormDateInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
  background: ${({ theme }) => theme === 'dark' ? '#2C2F30' : '#fff'};

  &:focus {
    outline: none;
    border-color: #005EFF;
  }
`;

export default function Targetolog() {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalText, setModalText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setUploadSuccess(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCampaignAction = (id, action) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === id) {
        const newStatus = action === 'start' ? 'active' : 'stopped';
        setModalType('success');
        setModalText(action === 'start' ? 'Кампания запущена' : 'Кампания остановлена');
        setShowModal(true);
        return { ...campaign, status: newStatus };
      }
      return campaign;
    });
    setCampaigns(updatedCampaigns);
  };

  const handleAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled);
    setModalType('success');
    setModalText(autopilotEnabled ? 'Автопилот выключен' : 'Автопилот включен');
    setShowModal(true);
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
  };

  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    
    if (value.length > 0) {
      const filtered = citiesKZ.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = (city) => {
    setCityInput(city);
    setShowCitySuggestions(false);
  };

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <ModalOverlay onClick={() => setShowModal(false)}>
        <ModalWindow onClick={e => e.stopPropagation()}>
          <ModalTitle>Текст</ModalTitle>
          <ModalDivider />
          <ModalButton onClick={() => setShowModal(false)}>Ok</ModalButton>
        </ModalWindow>
      </ModalOverlay>
    );
  };

  const renderCreateModal = () => {
    if (!showCreateModal) return null;

    return (
      <ModalOverlay onClick={() => setShowCreateModal(false)}>
        <ModalWindow onClick={e => e.stopPropagation()}>
          <ModalTitle>Создание кампании</ModalTitle>
          
          <FormGroup>
            <FormLabel theme={theme}>Цель кампании</FormLabel>
            <FormSelect theme={theme}>
              <option value="traffic">Трафик</option>
              <option value="conversion">Конверсии</option>
              <option value="reach">Охват</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Геолокация аудитории</FormLabel>
            <CitySearchContainer>
              <CityInput
                theme={theme}
                value={cityInput}
                onChange={handleCityInputChange}
                placeholder="Выберите город"
              />
              {showCitySuggestions && (
                <CitySuggestions theme={theme}>
                  {filteredCities.map((city, index) => (
                    <CitySuggestion
                      key={index}
                      theme={theme}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </CitySuggestion>
                  ))}
                </CitySuggestions>
              )}
            </CitySearchContainer>
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Бюджет кампании</FormLabel>
            <FormInput
              theme={theme}
              type="number"
              placeholder="Введите сумму"
              min="0"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Дата начала</FormLabel>
            <FormDateInput
              theme={theme}
              type="date"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel theme={theme}>Время начала</FormLabel>
            <FormDateInput
              theme={theme}
              type="time"
            />
          </FormGroup>

          <ModalButton onClick={() => setShowCreateModal(false)}>Создать кампанию</ModalButton>
        </ModalWindow>
      </ModalOverlay>
    );
  };

  return (
    <Container theme={theme}>
      <Title theme={theme}>ИИ Таргетолог</Title>
      <Divider />
      
      <UploadBlock>
        <FileInputRow>
          <FileInput
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <FileLabel htmlFor="file">
            <img src={fileIcon} alt="Upload" />
            {selectedFile ? selectedFile.name : 'Загрузить креатив'}
          </FileLabel>
          <UploadButton onClick={handleUpload}>Загрузить</UploadButton>
        </FileInputRow>
        {uploadSuccess && <UploadSuccess>Креатив успешно загружен</UploadSuccess>}
      </UploadBlock>

      <MainButton onClick={handleCreateCampaign}>Запустить кампанию</MainButton>

      <OverviewBlock>
        <OverviewItem>
          <div>Показы</div>
          <div>0</div>
        </OverviewItem>
        <OverviewItem>
          <div>Клики</div>
          <div>0</div>
        </OverviewItem>
        <OverviewItem>
          <div>CTR</div>
          <div>0%</div>
        </OverviewItem>
      </OverviewBlock>

      <CampaignsSection>
        <CampaignsTitle>Кампании</CampaignsTitle>
        <CampaignList>
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id}>
              <CampaignHeader>
                <CampaignName>{campaign.name}</CampaignName>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CampaignStatus active={campaign.status === 'active'}>
                    {campaign.status === 'active' ? 'Активна' : 'Остановлена'}
                  </CampaignStatus>
                  <CampaignAction
                    active={campaign.status === 'active'}
                    onClick={() => handleCampaignAction(campaign.id, campaign.status === 'active' ? 'stop' : 'start')}
                  >
                    {campaign.status === 'active' ? 'Остановить' : 'Запустить'}
                  </CampaignAction>
                </div>
              </CampaignHeader>
              <CampaignStats>
                <div>Показы: {campaign.stats.impressions}</div>
                <div>Клики: {campaign.stats.clicks}</div>
                <div>CTR: {campaign.stats.ctr}%</div>
              </CampaignStats>
            </CampaignCard>
          ))}
        </CampaignList>
      </CampaignsSection>

      <AdviceSection>
        <AdviceTitle>Советы от ИИ</AdviceTitle>
        <AdviceBox>
          Загрузите креатив, чтобы получить рекомендации по улучшению эффективности кампании
        </AdviceBox>
      </AdviceSection>

      <AutopilotSection>
        <AutopilotTitle>Автопилот</AutopilotTitle>
        <AutopilotButton
          enabled={autopilotEnabled}
          onClick={handleAutopilot}
        >
          {autopilotEnabled ? 'Выключить автопилот' : 'Включить автопилот'}
        </AutopilotButton>
        <HistoryList>
          {autopilotEnabled && (
            <HistoryItem>
              Автопилот включен в {new Date().toLocaleTimeString()}
            </HistoryItem>
          )}
        </HistoryList>
      </AutopilotSection>

      {renderModal()}
      {renderCreateModal()}
    </Container>
  );
} 
