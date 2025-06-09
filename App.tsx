import React, { useEffect, useState } from 'react';
import { setTheme, getTheme, Theme } from './theme';
import AnalyticsIcon from './icons/AnalyticsIcon';
import CreativesIcon from './icons/CreativesIcon';
import AutopilotIcon from './icons/AutopilotIcon';
import RecommendationsIcon from './icons/RecommendationsIcon';

interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused';
  stats: { clicks: number; budget: number; };
}

const mockCampaigns: Campaign[] = [
  { id: 1, name: 'Лидогенерация', status: 'active', stats: { clicks: 120, budget: 5000 } },
  { id: 2, name: 'Трафик на сайт', status: 'paused', stats: { clicks: 80, budget: 3000 } },
];

export default function App() {
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [showUpload, setShowUpload] = useState(false);
  const [showAutopilot, setShowAutopilot] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTheme(theme);
    // Telegram WebApp API init
    // @ts-ignore
    window.Telegram?.WebApp?.ready && window.Telegram.WebApp.ready();
    // @ts-ignore
    window.Telegram?.WebApp?.expand && window.Telegram.WebApp.expand();
  }, [theme]);

  return (
    <div className="container">
      <header className="header">
        <span className="logo">ИИ Таргетолог</span>
        <button className="btn" onClick={() => setThemeState(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </header>
      <main className="main-content">
        <h1>Ваши кампании</h1>
        <div className="campaigns-list">
          {campaigns.map(c => (
            <div className="campaign-card" key={c.id}>
              <div className="campaign-header">
                <span className="campaign-title">{c.name}</span>
                <span className={`campaign-status status-${c.status}`}>{c.status === 'active' ? 'Активна' : 'Пауза'}</span>
              </div>
              <div className="campaign-stats">
                <span className="stat-item"><span className="stat-value">{c.stats.clicks}</span> кликов</span>
                <span className="stat-item"><span className="stat-value">{c.stats.budget}₽</span> бюджет</span>
              </div>
            </div>
          ))}
        </div>
        <div className="section">
          <button className="btn btn-primary" onClick={() => setShowUpload(true)}>Загрузить креатив</button>
        </div>
        <div className="section">
          <button className="btn" onClick={() => setShowAutopilot(true)}>ИИ-автопилот</button>
        </div>
        <div className="section">
          <button className="btn" onClick={() => setShowRecommendations(true)}>Рекомендации</button>
        </div>
        <div className="section">
          <button className="btn" onClick={() => alert('Вход через Facebook (заглушка)')}>Войти через Facebook</button>
        </div>
      </main>
      {/* Модальные окна */}
      {showUpload && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Загрузка креатива</span>
              <button className="close-btn" onClick={() => setShowUpload(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Выберите файл</label>
              <input className="form-input" type="file" accept="image/*,video/*" />
            </div>
            <button className={`btn btn-primary${uploadLoading ? ' loading' : ''}`} disabled={uploadLoading} onClick={() => {
              setUploadLoading(true);
              setTimeout(() => { setUploadLoading(false); setShowUpload(false); }, 1800);
            }}>Загрузить</button>
          </div>
        </div>
      )}
      {showAutopilot && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">ИИ-автопилот</span>
              <button className="close-btn" onClick={() => setShowAutopilot(false)}>×</button>
            </div>
            <div className="autopilot-controls">
              <label className="switch">
                <input type="checkbox" checked={autopilotEnabled} onChange={e => setAutopilotEnabled(e.target.checked)} />
                <span className="slider"></span>
              </label>
              <span className="autopilot-status">{autopilotEnabled ? 'Автопилот включен' : 'Автопилот выключен'}</span>
            </div>
            <div className="progress-bar"><div className="progress-bar-inner" style={{width: autopilotEnabled ? '100%' : '0%'}} /></div>
            <button className="btn btn-primary" onClick={() => setAutopilotEnabled(v => !v)}>{autopilotEnabled ? 'Выключить' : 'Включить'}</button>
          </div>
        </div>
      )}
      {showRecommendations && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Рекомендации</span>
              <button className="close-btn" onClick={() => setShowRecommendations(false)}>×</button>
            </div>
            <div className="recommendations-list">
              <div className="recommendation-card">Используйте больше креативов для A/B тестирования.</div>
              <div className="recommendation-card">Оптимизируйте бюджет для лучших кампаний.</div>
            </div>
          </div>
        </div>
      )}
      <nav className="bottom-nav">
        <div className="nav-item active"><AnalyticsIcon className="nav-icon" /><span>Кампании</span></div>
        <div className="nav-item"><CreativesIcon className="nav-icon" /><span>Креативы</span></div>
        <div className="nav-item"><AutopilotIcon className="nav-icon" /><span>Автопилот</span></div>
        <div className="nav-item"><RecommendationsIcon className="nav-icon" /><span>Рекомендации</span></div>
      </nav>
    </div>
  );
} 