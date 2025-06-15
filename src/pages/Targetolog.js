import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import fileIcon from '../assets/icons/file-upload.svg';
import megaphoneIcon from '../assets/icons/megaphone-bg.svg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useStore from '../store';
import { useThemeContext, themes } from '../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid ${({ theme }) => theme.border};
  margin: 18px 0 24px 0;
`;

const UploadBlock = styled.div`
  background: ${({ theme }) => theme.card};
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
  background: ${({ theme }) => theme.card};
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  flex: 1;
`;

const UploadButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
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
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 0;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
`;

const OverviewBlock = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  margin: 18px 16px 0 16px;
  padding: 14px 0 10px 0;
  display: flex;
  justify-content: space-around;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
  margin-bottom: 12px;
`;

const CampaignList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CampaignCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 14px;
  padding: 18px 16px 18px 16px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid ${({ theme }) => theme.border};
`;

const CampaignHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const CampaignName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;

const CampaignStatus = styled.div`
  font-size: 15px;
  color: ${({ active }) => active ? '#1BC47D' : '#F44336'};
  font-weight: 600;
  margin-top: 2px;
`;

const CampaignMeta = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
`;

const CampaignStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0;
  margin-top: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const CampaignAction = styled.button`
  background: ${({ active, theme }) => active ? '#F44336' : theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  margin-left: 12px;
`;

const AdviceSection = styled.div`
  margin: 32px 16px 0 16px;
`;

const AdviceTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const AdviceBox = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 16px;
  font-size: 15px;
  color: ${({ theme }) => theme.text};
  min-height: 60px;
`;

const AutopilotSection = styled.div`
  margin: 32px 16px 0 16px;
`;

const AutopilotTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
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
  animation: fadeIn 0.2s;
`;

const ModalWindow = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  padding: 32px 18px 0 18px;
  max-width: 340px;
  width: 90vw;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  animation: slideUp 0.25s;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
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
  background: ${({ theme }) => theme.border};
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
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
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.card};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const CitySuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
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
  color: ${({ theme }) => theme.text};
  font-size: 15px;

  &:hover {
    background: ${({ theme }) => theme.buttonSecondary};
  }
`;

const citiesKZ = [
  'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей', 'Атырау', 'Кызылорда', 'Костанай', 'Петропавловск', 'Актау', 'Темиртау', 'Туркестан', 'Экибастуз', 'Талдыкорган', 'Жезказган', 'Рудный', 'Кокшетау', 'Кентау', 'Балхаш', 'Жанаозен', 'Степногорск', 'Сатпаев', 'Аксай', 'Шу', 'Сарыагаш', 'Аягоз', 'Шахтинск', 'Лисаковск', 'Щучинск', 'Арыс', 'Кульсары', 'Жаркент', 'Каратау', 'Шардара', 'Сергеевка', 'Капшагай', 'Житикара', 'Каскелен', 'Текели', 'Форт-Шевченко', 'Арал', 'Абай', 'Байконур', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каражал', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз', 'Аксай', 'Арал', 'Арыс', 'Абай', 'Актау', 'Актобе', 'Алматы', 'Астана', 'Атырау', 'Байконур', 'Балхаш', 'Булаево', 'Есик', 'Зайсан', 'Зыряновск', 'Кандыагаш', 'Караганда', 'Каражал', 'Карасу', 'Карасук', 'Каратау', 'Каскелен', 'Кентау', 'Кокшетау', 'Костанай', 'Кульсары', 'Кызылорда', 'Лисаковск', 'Павлодар', 'Петропавловск', 'Риддер', 'Рудный', 'Сарань', 'Сарыагаш', 'Сатпаев', 'Семей', 'Степногорск', 'Талдыкорган', 'Тараз', 'Текели', 'Темиртау', 'Туркестан', 'Уральск', 'Усть-Каменогорск', 'Шахтинск', 'Шардара', 'Шымкент', 'Щучинск', 'Экибастуз', 'Жезказган', 'Житикара', 'Жаркент', 'Аягоз'];

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
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.card};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.card};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormDateInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.card};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Card = styled.div`
  background: ${({ active, theme }) => active ? theme.primary : theme.card};
  color: ${({ active, theme }) => active ? theme.buttonText : theme.text};
`;

const CampaignObjectiveGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;
const ObjectiveBlock = styled.div`
  padding: 18px 0;
  border-radius: 12px;
  background: ${({ selected, theme }) => selected ? theme.buttonSecondary : theme.card};
  color: ${({ selected, theme }) => selected ? theme.primary : theme.text};
  font-weight: 600;
  font-size: 17px;
  text-align: center;
  border: 2px solid ${({ selected, theme }) => selected ? theme.primary : theme.border};
  cursor: pointer;
  transition: all 0.2s;
`;

const OBJECTIVES = [
  { value: 'conversion', label: 'Конверсия' },
  { value: 'traffic', label: 'Посещения сайта' },
  { value: 'leads', label: 'Лиды' },
  { value: 'engagement', label: 'Вовлеченность' },
];

const StatusBadge = styled.div`
  display: inline-block;
  min-width: 80px;
  padding: 4px 16px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: ${({ active }) => active ? '#1BC47D' : '#BDBDBD'};
  margin-right: 12px;
  margin-top: 4px;
  text-align: center;
`;

const CampaignCardRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const CampaignCardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 2px;
`;

const CampaignActionBtn = styled.button`
  background: ${({ active }) => active ? '#F44336' : '#005EFF'};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 22px;
  cursor: pointer;
  margin-left: 12px;
  margin-top: 2px;
  transition: background 0.2s;
`;

const CampaignStatsGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
  gap: 0;
`;

const StatCol = styled.div`
  text-align: center;
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #888;
  margin-bottom: 2px;
`;

const StatValue = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export default function Targetolog() {
  const { theme } = useThemeContext();
  const themeObj = themes[theme];
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const fileInputRef = useRef(null);
  const [objective, setObjective] = useState('traffic');
  const [budget, setBudget] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const addNotification = useStore((state) => state.addNotification);

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
      addNotification('Креатив успешно загружен', 'success');
    } else {
      addNotification('Ошибка при загрузке', 'error');
    }
  };

  const handleCampaignAction = (id, action) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === id) {
        const newStatus = action === 'start' ? 'active' : 'stopped';
        addNotification(action === 'start' ? 'Кампания запущена' : 'Кампания остановлена', action === 'start' ? 'success' : 'error');
        return { ...campaign, status: newStatus };
      }
      return campaign;
    });
    setCampaigns(updatedCampaigns);
  };

  const handleAutopilot = () => {
    setAutopilotEnabled(!autopilotEnabled);
    addNotification(!autopilotEnabled ? 'Автопилот включён' : 'Автопилот выключен', 'success');
  };

  const handleCreateCampaign = () => {
    setShowCreateModal(true);
    setObjective('traffic');
    setBudget('');
    setDate('');
    setTime('');
    setCityInput('');
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

  const handleSubmitCampaign = () => {
    const newCampaign = {
      id: Date.now(),
      name: `Кампания ${campaigns.length + 1}`,
      status: 'active',
      stats: { clicks: 0, impressions: 0, ctr: 0 },
      objective,
      city: cityInput,
      budget,
      date,
      time,
    };
    setCampaigns([newCampaign, ...campaigns]);
    setShowCreateModal(false);
    addNotification('Кампания успешно создана', 'success');
  };

  const renderCreateModal = () => {
    if (!showCreateModal) return null;
    return (
      <ModalOverlay onClick={() => setShowCreateModal(false)}>
        <ModalWindow onClick={e => e.stopPropagation()}>
          <ModalClose onClick={() => setShowCreateModal(false)}>&#10005;</ModalClose>
          <ModalTitle>Создание кампании</ModalTitle>
          <FormGroup>
            <FormLabel>Цель кампании</FormLabel>
            <CampaignObjectiveGrid>
              {OBJECTIVES.map(obj => (
                <ObjectiveBlock
                  key={obj.value}
                  selected={objective === obj.value}
                  onClick={() => setObjective(obj.value)}
                >
                  {obj.label}
                </ObjectiveBlock>
              ))}
            </CampaignObjectiveGrid>
          </FormGroup>
          <FormGroup>
            <FormLabel>Геолокация аудитории</FormLabel>
            <CitySearchContainer>
              <CityInput
                value={cityInput}
                onChange={handleCityInputChange}
                placeholder="Выберите город"
              />
              {showCitySuggestions && (
                <CitySuggestions>
                  {filteredCities.map((city, index) => (
                    <CitySuggestion
                      key={index}
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
            <FormLabel>Бюджет кампании</FormLabel>
            <FormInput
              type="number"
              placeholder="Введите сумму"
              min="0"
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Дата начала</FormLabel>
            <FormDateInput
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <FormLabel>Время начала</FormLabel>
            <FormDateInput
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </FormGroup>
          <ModalButton onClick={handleSubmitCampaign}>Создать кампанию</ModalButton>
        </ModalWindow>
      </ModalOverlay>
    );
  };

  useEffect(() => {
    if (showCreateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showCreateModal]);

  return (
    <Container theme={themeObj}>
      <Title theme={themeObj}>ИИ Таргетолог</Title>
      <Divider theme={themeObj} />
      
      <UploadBlock theme={themeObj}>
        <FileInputRow>
          <FileInput
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <FileLabel theme={themeObj} htmlFor="file">
            <img src={fileIcon} alt="Upload" />
            {selectedFile ? selectedFile.name : 'Загрузить креатив'}
          </FileLabel>
          <UploadButton theme={themeObj} onClick={handleUpload}>Загрузить</UploadButton>
        </FileInputRow>
        {uploadSuccess && <UploadSuccess>Креатив успешно загружен</UploadSuccess>}
      </UploadBlock>

      <MainButton theme={themeObj} onClick={handleCreateCampaign}>Запустить кампанию</MainButton>

      <OverviewBlock theme={themeObj}>
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
        <CampaignsTitle theme={themeObj}>Кампании</CampaignsTitle>
        {campaigns.length === 0 ? (
          <div style={{textAlign:'center',color:'#888',margin:'32px 0'}}>Нет кампаний</div>
        ) : (
          <CampaignList>
            <TransitionGroup component={null}>
              {campaigns.map(campaign => (
                <CSSTransition key={campaign.id} classNames="card" timeout={300}>
                  <CampaignCard theme={themeObj}>
                    <CampaignCardRow>
                      <div>
                        <CampaignCardTitle theme={themeObj}>{campaign.name}</CampaignCardTitle>
                        <StatusBadge active={campaign.status === 'active'}>
                          {campaign.status === 'active' ? 'Активна' : 'Приостановлена'}
                        </StatusBadge>
                      </div>
                      <CampaignActionBtn
                        active={campaign.status === 'active'}
                        onClick={() => handleCampaignAction(campaign.id, campaign.status === 'active' ? 'stop' : 'start')}
                      >
                        {campaign.status === 'active' ? 'Остановить' : 'Запустить'}
                      </CampaignActionBtn>
                    </CampaignCardRow>
                    <CampaignStatsGrid>
                      <StatCol>
                        <StatLabel>Клики</StatLabel>
                        <StatValue theme={themeObj}>{campaign.stats?.clicks ?? 0}</StatValue>
                      </StatCol>
                      <StatCol>
                        <StatLabel>Показы</StatLabel>
                        <StatValue theme={themeObj}>{campaign.stats?.impressions ?? 0}</StatValue>
                      </StatCol>
                      <StatCol>
                        <StatLabel>CTR</StatLabel>
                        <StatValue theme={themeObj}>{campaign.stats?.ctr ?? 0}%</StatValue>
                      </StatCol>
                      <StatCol>
                        <StatLabel>CPC</StatLabel>
                        <StatValue theme={themeObj}>{campaign.stats?.cpc ?? 0}</StatValue>
                      </StatCol>
                      <StatCol>
                        <StatLabel>CPM</StatLabel>
                        <StatValue theme={themeObj}>{campaign.stats?.cpm ?? 0}</StatValue>
                      </StatCol>
                    </CampaignStatsGrid>
                  </CampaignCard>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </CampaignList>
        )}
      </CampaignsSection>

      <AdviceSection>
        <AdviceTitle theme={themeObj}>Советы от ИИ</AdviceTitle>
        <AdviceBox theme={themeObj}>
          Загрузите креатив, чтобы получить рекомендации по улучшению эффективности кампании
        </AdviceBox>
      </AdviceSection>

      <AutopilotSection>
        <AutopilotTitle theme={themeObj}>Автопилот</AutopilotTitle>
        <AutopilotButton
          enabled={autopilotEnabled}
          onClick={handleAutopilot}
        >
          {autopilotEnabled ? 'Выключить автопилот' : 'Включить автопилот'}
        </AutopilotButton>
        <HistoryList>
          {autopilotEnabled && (
            <HistoryItem theme={themeObj}>
              Автопилот включен в {new Date().toLocaleTimeString()}
            </HistoryItem>
          )}
        </HistoryList>
      </AutopilotSection>

      {showCreateModal && (
        <CSSTransition in={showCreateModal} timeout={200} classNames="modal" unmountOnExit>
          {renderCreateModal()}
        </CSSTransition>
      )}
    </Container>
  );
} 
