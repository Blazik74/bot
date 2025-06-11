import React, { useRef, useState } from 'react';
import './TargetologPage.css';
import { StartCampaignModal } from '../components/StartCampaignModal';

// Типы для кампаний и автопилота
export type CampaignStatus = 'active' | 'paused';
export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  clicks: number;
  impressions: number;
  spent: number;
}

export interface AutopilotState {
  enabled: boolean;
}

const initialCampaigns: Campaign[] = [];
const initialAutopilot: AutopilotState = { enabled: false };

const TargetologPage: React.FC = () => {
  // Состояния для интеграции с бэком
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [autopilot, setAutopilot] = useState<AutopilotState>(initialAutopilot);
  const [file, setFile] = useState<File | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Метрики для обзора
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const ctr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const cpc = totalClicks ? (totalSpent / totalClicks).toFixed(2) : '0';
  const cpm = totalImpressions ? ((totalSpent / totalImpressions) * 1000).toFixed(2) : '0';

  // Загрузка креатива
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && ['image/png', 'video/mp4', 'video/quicktime'].includes(f.type)) {
      setFile(f);
      setNotification('Креатив загружен успешно');
    } else {
      setNotification('Ошибка при загрузке');
    }
  };

  // Запуск кампании (заглушка)
  const handleStartCampaign = () => {
    setModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    setNotification('Кампания создана!');
    // Здесь можно добавить интеграцию с бэком
  };

  // Управление автопилотом
  const handleToggleAutopilot = () => {
    setAutopilot((prev) => ({ enabled: !prev.enabled }));
    setNotification(prev => autopilot.enabled ? 'Автопилот выключен' : 'Автопилот включен');
  };

  // Управление кампаниями
  const handlePause = (id: string) => {
    setCampaigns((prev) => prev.map(c => c.id === id ? { ...c, status: 'paused' } : c));
    setNotification('Кампания приостановлена');
  };
  const handleResume = (id: string) => {
    setCampaigns((prev) => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
    setNotification('Кампания активна');
  };

  return (
    <div className="targetolog-page">
      <h2>ИИ Таргетолог</h2>
      <div className="creative-upload-block">
        <input
          type="file"
          accept="image/png,video/mp4,video/quicktime"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button className="file-btn" onClick={() => fileInputRef.current?.click()}>
          {file ? file.name : 'Выбрать файл'}
        </button>
        <div className="file-formats">Поддерживаемые форматы: mp4, mov, png</div>
      </div>
      <button className="start-campaign-btn" onClick={handleStartCampaign}>
        Запустить кампанию
      </button>
      <div className="overview-block">
        <div className="overview-row">
          <div>
            <div className="overview-label">Клики</div>
            <div className="overview-value">{totalClicks}</div>
          </div>
          <div>
            <div className="overview-label">Показы</div>
            <div className="overview-value">{totalImpressions}</div>
          </div>
        </div>
        <div className="overview-metrics">
          <div>
            <div className="metric-label">CTR</div>
            <div className="metric-value">{ctr}%</div>
          </div>
          <div>
            <div className="metric-label">CPC</div>
            <div className="metric-value">${cpc}</div>
          </div>
          <div>
            <div className="metric-label">CPM</div>
            <div className="metric-value">${cpm}</div>
          </div>
        </div>
      </div>
      <div className="campaigns-block">
        <h3>Рекламные кампании</h3>
        {campaigns.length === 0 ? (
          <div className="empty-campaigns">Нет активных кампаний</div>
        ) : (
          campaigns.map(c => (
            <div key={c.id} className="campaign-row">
              <div className={`campaign-status ${c.status}`}>{c.status === 'active' ? 'Активна' : 'Приостановлена'}</div>
              <div className="campaign-info">
                <div>Клики: {c.clicks}</div>
                <div>Показы: {c.impressions}</div>
                <div>Потрачено: ${c.spent}</div>
              </div>
              {c.status === 'active' ? (
                <button className="pause-btn" onClick={() => handlePause(c.id)}>Остановить</button>
              ) : (
                <button className="resume-btn" onClick={() => handleResume(c.id)}>Запустить</button>
              )}
            </div>
          ))
        )}
      </div>
      <div className="autopilot-block">
        <div className="autopilot-status-row">
          <div className={`autopilot-indicator ${autopilot.enabled ? 'on' : 'off'}`}>{autopilot.enabled ? 'Включен' : 'Выключен'}</div>
          <button className="autopilot-toggle-btn" onClick={handleToggleAutopilot}>
            {autopilot.enabled ? 'Выключить автопилот' : 'Включить автопилот'}
          </button>
        </div>
        {autopilot.enabled && (
          <div className="ai-tips-block">
            <div className="tips-header">
              Советы от ИИ
              <button className="refresh-tips-btn">Обновить советы</button>
            </div>
            <div className="tips-list">
              <div className="tip-item">Совет 1: ...</div>
              <div className="tip-item">Совет 2: ...</div>
            </div>
          </div>
        )}
      </div>
      {notification && (
        <div className="notification-block">
          {notification}
          <button className="close-notification" onClick={() => setNotification(null)}>Ok</button>
        </div>
      )}
      <StartCampaignModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} />
    </div>
  );
};

export default TargetologPage; 