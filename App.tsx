import React, { useEffect, useState } from 'react';
import { setTheme, getTheme, Theme } from './theme';
import AnalyticsIcon from './AnalyticsIcon';
import CreativesIcon from './CreativesIcon';
import AutopilotIcon from './AutopilotIcon';

function CampaignsScreen({ onShowUpload }: { onShowUpload: () => void }) {
  const campaigns = [
    { id: 1, name: 'Лидогенерация', status: 'active', stats: { clicks: 120, budget: 5000 } },
    { id: 2, name: 'Трафик на сайт', status: 'paused', stats: { clicks: 80, budget: 3000 } },
  ];
  return (
    <div className="fadein">
      <h1 className="screen-title">Кампании</h1>
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
      <div className="section"><button className="btn btn-primary" onClick={onShowUpload}>Загрузить креатив</button></div>
    </div>
  );
}
function CreativesScreen() {
  return (
    <div className="fadein">
      <h1 className="screen-title">Креативы</h1>
      <div className="creatives-placeholder">Здесь будут ваши креативы</div>
      <div className="section"><button className="btn btn-primary">Добавить креатив</button></div>
    </div>
  );
}
function AutopilotScreen({ autopilotEnabled, setAutopilotEnabled }: { autopilotEnabled: boolean, setAutopilotEnabled: (v: boolean) => void }) {
  return (
    <div className="fadein">
      <h1 className="screen-title">Автопилот</h1>
      <div className="autopilot-controls">
        <label className="switch">
          <input type="checkbox" checked={autopilotEnabled} onChange={e => setAutopilotEnabled(e.target.checked)} />
          <span className="slider"></span>
        </label>
        <span className="autopilot-status">{autopilotEnabled ? 'Включен' : 'Выключен'}</span>
      </div>
      <div className="progress-bar"><div className="progress-bar-inner" style={{width: autopilotEnabled ? '100%' : '0%'}} /></div>
    </div>
  );
}

export default function App() {
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const [activeTab, setActiveTab] = useState(0); // 0: кампании, 1: креативы, 2: автопилот
  const [showUpload, setShowUpload] = useState(false);
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

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
        {activeTab === 0 && <CampaignsScreen onShowUpload={() => setShowUpload(true)} />}
        {activeTab === 1 && <CreativesScreen />}
        {activeTab === 2 && <AutopilotScreen autopilotEnabled={autopilotEnabled} setAutopilotEnabled={setAutopilotEnabled} />}
      </main>
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
      <nav className="bottom-nav">
        <div className={`nav-item${activeTab === 0 ? ' active' : ''}`} onClick={() => setActiveTab(0)}><AnalyticsIcon className="nav-icon" /><span>Кампании</span></div>
        <div className={`nav-item${activeTab === 1 ? ' active' : ''}`} onClick={() => setActiveTab(1)}><CreativesIcon className="nav-icon" /><span>Креативы</span></div>
        <div className={`nav-item${activeTab === 2 ? ' active' : ''}`} onClick={() => setActiveTab(2)}><AutopilotIcon className="nav-icon" /><span>Автопилот</span></div>
      </nav>
    </div>
  );
}
// fadein анимация для плавного перехода между экранами
// ... existing code ... 