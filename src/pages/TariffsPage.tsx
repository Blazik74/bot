import React, { useState } from 'react';
import './TariffsPage.css';

const tariffs = [
  {
    key: 'freelancer',
    name: 'Фрилансер',
    price: 50000,
    description: 'Для индивидуальных специалистов',
  },
  {
    key: 'company',
    name: 'Компания',
    price: 80000,
    description: 'Для агентств и команд',
  },
];

const TariffsPage: React.FC = () => {
  const [selected, setSelected] = useState('freelancer');
  const [notification, setNotification] = useState<string | null>(null);
  const handlePay = () => {
    setNotification('Заказ создан и передан менеджерам!');
    // Здесь будет интеграция с бэком
  };
  return (
    <div className="tariffs-page">
      <h2>Тарифы и оплата</h2>
      <div className="tariffs-list">
        {tariffs.map(tariff => (
          <div
            key={tariff.key}
            className={`tariff-card${selected === tariff.key ? ' selected' : ''}`}
            onClick={() => setSelected(tariff.key)}
          >
            <div className="tariff-name">{tariff.name}</div>
            <div className="tariff-price">{tariff.price.toLocaleString()} ₸/мес</div>
            <div className="tariff-desc">{tariff.description}</div>
          </div>
        ))}
      </div>
      <button className="pay-btn" onClick={handlePay}>Оплатить</button>
      {notification && (
        <div className="tariff-notification">
          {notification}
          <button className="close-notification" onClick={() => setNotification(null)}>Ok</button>
        </div>
      )}
    </div>
  );
};

export default TariffsPage; 