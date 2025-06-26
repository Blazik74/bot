import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useUser } from '../contexts/UserContext';
import api from '../api';
import { useThemeContext, themes } from '../contexts/ThemeContext';

const LoaderAnim = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin: 40px 0 16px 0;
`;

const Subtitle = styled.div`
  text-align: center;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 32px;
`;

const TariffList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0 auto 32px auto;
  max-width: 400px;
  width: 100%;
`;

const TariffCard = styled.div`
  background: ${({ selected, theme }) => selected ? '#fff' : theme.card};
  color: ${({ selected, theme }) => selected ? '#222' : theme.text};
  border: 2px solid ${({ selected, theme }) => selected ? theme.primary : 'transparent'};
  border-radius: 18px;
  padding: ${({ selected }) => selected ? '32px 24px 24px 24px' : '18px 18px 14px 18px'};
  margin-bottom: 0;
  box-shadow: ${({ selected }) => selected ? '0 2px 12px 0 rgba(0,94,255,0.08)' : 'none'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  min-height: ${({ selected }) => selected ? '120px' : '70px'};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TariffName = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const TariffDesc = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 8px;
`;

const TariffPriceRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin-top: 8px;
`;

const TariffPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const TariffPerMonth = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 2px;
`;

const PayButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 500;
  padding: 18px 0;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
  margin: 32px auto 0 auto;
  display: block;
  transition: background 0.2s;
`;

const SkeletonCard = styled.div`
  height: 120px;
  border-radius: 18px;
  background: ${({ theme }) => theme.card};
  margin-bottom: 18px;
  animation: ${LoaderAnim} 1.2s infinite;
`;

export default function Tariffs() {
  const { user } = useUser();
  const { theme } = useThemeContext();
  const themeObj = themes[theme] || themes.light;
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/tariffs');
        const filtered = response.data.filter(t => t.name !== 'Бесплатный');
        setTariffs(filtered);
        if (user?.tariff?.id) setSelected(user.tariff.id);
      } catch (err) {
        setError(err?.message || String(err));
        setTariffs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTariffs();
  }, [user]);

  const getDesc = (tariff) => {
    if (tariff.name === 'Фрилансер') return 'ограниченные функции';
    if (tariff.name === 'Компания') return 'всё включено';
    return '';
  };

  const getButtonText = () => {
    if (!selected) return 'Оплатить';
    const sel = tariffs.find(t => t.id === selected);
    if (!sel) return 'Оплатить';
    if (user?.tariff?.id === sel.id) return 'Продлить';
    return 'Оплатить';
  };

  return (
    <Page theme={themeObj}>
      <Title>Тарифы и оплата</Title>
      <Subtitle theme={themeObj}>Подберите идеальный тариф для вашего бизнеса</Subtitle>
      {error && <div style={{color:'red',margin:'16px',textAlign:'center'}}>Ошибка загрузки тарифов: {error}</div>}
      <div style={{fontSize:12,background:'#222',color:'#fff',padding:8,margin:'8px 0',borderRadius:8}}>
        <b>user:</b> <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(user,null,2)}</pre>
        <b>tariffs:</b> <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(tariffs,null,2)}</pre>
      </div>
      <TariffList>
        {loading ? (
          Array(2).fill(0).map((_, i) => <SkeletonCard key={i} theme={themeObj} />)
        ) : tariffs.length === 0 ? (
          <div style={{textAlign:'center',color:'#888',margin:'32px 0'}}>Нет тарифов</div>
        ) : (
          tariffs.map(tariff => (
            <TariffCard
              key={tariff.id}
              selected={selected === tariff.id}
              theme={themeObj}
              onClick={() => setSelected(tariff.id)}
            >
              <TariffName>{tariff.name}</TariffName>
              <TariffDesc>{getDesc(tariff)}</TariffDesc>
              <TariffPriceRow>
                <TariffPrice>{tariff.price}₽</TariffPrice>
                <TariffPerMonth>в месяц</TariffPerMonth>
              </TariffPriceRow>
            </TariffCard>
          ))
        )}
      </TariffList>
      <PayButton theme={themeObj} disabled={!selected}>
        {getButtonText()}
      </PayButton>
    </Page>
  );
}

// CSS для fadeInTariff
// @keyframes fadeInTariff { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } } 
