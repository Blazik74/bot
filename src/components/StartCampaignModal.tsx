import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './StartCampaignModal.css';

interface StartCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const goals = [
  'Конверсия',
  'Посещения сайта',
  'Лиды',
  'Вовлеченность',
];

const cities = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Караганда',
  'Актобе',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
  'Костанай',
];

export const StartCampaignModal: React.FC<StartCampaignModalProps> = ({ open, onClose, onSubmit }) => {
  const [goal, setGoal] = useState(goals[0]);
  const [geo, setGeo] = useState<string[]>([]);
  const [allCountry, setAllCountry] = useState(false);
  const [budget, setBudget] = useState('1');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:00`;
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const handleGeoChange = (city: string) => {
    setGeo((prev) => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ goal, geo: allCountry ? ['Казахстан'] : geo, budget, date, time });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="modal-window" initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <button className="modal-close" onClick={onClose}>×</button>
            <form onSubmit={handleSubmit}>
              <h3>Цель кампании</h3>
              <div className="goals-row">
                {goals.map(g => (
                  <button type="button" key={g} className={goal === g ? 'active' : ''} onClick={() => setGoal(g)}>{g}</button>
                ))}
              </div>
              <div className="modal-section">
                <div className="modal-label">Геолокация аудитории</div>
                <div className="geo-block">
                  <input type="checkbox" id="all-country" checked={allCountry} onChange={e => { setAllCountry(e.target.checked); if (e.target.checked) setGeo([]); }} />
                  <label htmlFor="all-country">Вся страна (Казахстан)</label>
                </div>
                {!allCountry && (
                  <div className="cities-list">
                    {cities.map(city => (
                      <label key={city} className="city-checkbox">
                        <input type="checkbox" checked={geo.includes(city)} onChange={() => handleGeoChange(city)} />
                        {city}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-section">
                <div className="modal-label">Дневной бюджет ($)</div>
                <input type="number" min={1} value={budget} onChange={e => setBudget(e.target.value)} className="budget-input" />
              </div>
              <div className="modal-section">
                <div className="modal-label">Время публикации</div>
                <div className="date-time-row">
                  <div className="dropdown-block">
                    <button type="button" className="dropdown-btn" onClick={() => setShowDate(v => !v)}>{date}</button>
                    <AnimatePresence>
                      {showDate && (
                        <motion.div className="dropdown-list" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                          {[...Array(31)].map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() + i);
                            const val = d.toISOString().slice(0, 10);
                            return <div key={val} className="dropdown-item" onClick={() => { setDate(val); setShowDate(false); }}>{val}</div>;
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="dropdown-block">
                    <button type="button" className="dropdown-btn" onClick={() => setShowTime(v => !v)}>{time}</button>
                    <AnimatePresence>
                      {showTime && (
                        <motion.div className="dropdown-list" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                          {[...Array(24)].map((_, i) => {
                            const t = `${i.toString().padStart(2, '0')}:00`;
                            return <div key={t} className="dropdown-item" onClick={() => { setTime(t); setShowTime(false); }}>{t}</div>;
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <button className="modal-submit" type="submit">Запустить кампанию</button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 