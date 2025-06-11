import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className={`profile-page ${theme}`}>
      <h2>Профиль</h2>
      <div className="theme-switcher">
        <span>Тема:</span>
        <button
          className={theme === 'light' ? 'active' : ''}
          onClick={() => setTheme('light')}
        >
          Светлая
        </button>
        <button
          className={theme === 'dark' ? 'active' : ''}
          onClick={() => setTheme('dark')}
        >
          Тёмная
        </button>
      </div>
      {/* Здесь будет остальная информация профиля */}
    </div>
  );
};

export default ProfilePage; 