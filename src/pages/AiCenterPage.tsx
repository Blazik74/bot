import React from 'react';
import './AiCenterPage.css';

const AiCenterPage: React.FC = () => {
  return (
    <div className="ai-center-page">
      <h2>ИИ Центр</h2>
      <div className="ai-icons-row">
        <div className="ai-icon-block clickable">
          <div className="ai-icon-placeholder">🎯</div>
          <div className="ai-icon-label">ИИ Таргетолог</div>
        </div>
        <div className="ai-icon-block disabled">
          <div className="ai-icon-placeholder">👔</div>
          <div className="ai-icon-label">ИИ Бухгалтер</div>
        </div>
        <div className="ai-icon-block disabled">
          <div className="ai-icon-placeholder">📊</div>
          <div className="ai-icon-label">ИИ Продавец</div>
        </div>
        <div className="ai-icon-block disabled">
          <div className="ai-icon-placeholder">📝</div>
          <div className="ai-icon-label">ИИ Консультант</div>
        </div>
      </div>
      <button className="tariffs-btn">Тарифы и оплата</button>
    </div>
  );
};

export default AiCenterPage; 