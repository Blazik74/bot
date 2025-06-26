import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BottomNavigation from '../components/BottomNavigation';
import { useThemeContext, themes } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { tariffsApi, userApi } from '../api';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 0 0 40px 0;
  animation: fadeInTariff 0.4s;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: left;
  margin: 40px 0 32px 16px;
  color: ${({ theme }) => theme.text};
`;

const TariffList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0 16px;
`;

const TariffCard = styled.div`
  background: ${({ selected, theme }) => selected ? theme.card : theme.buttonSecondary};
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
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text};
`;

const TariffPerMonth = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 2px;
`;

const PayButton = styled.button`
  width: 90%;
  max-width: 400px;
  background: ${({ disabled, theme }) => disabled ? '#BDBDBD' : theme.primary};
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 500;
  padding: 18px 0;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
  margin: 32px auto 0 auto;
  display: block;
  transition: background 0.2s;
`;

const Tariffs = () => {
  const [selected, setSelected] = useState(null);
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { theme } = useThemeContext();
  const { user, refetchUser } = useUser();
  const themeObj = themes[theme];

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await tariffsApi.getAll();
        setTariffs(response.data);
        // Устанавливаем текущий тариф пользователя как выбранный
        if (user?.tariff?.id) {
          setSelected(user.tariff.id);
        }
      } catch (error) {
        console.error('Error fetching tariffs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();
  }, [user]);

  const handleTariffSelect = (tariffId) => {
    setSelected(tariffId);
  };

  const handlePayClick = async () => {
    if (!selected || updating) return;

    setUpdating(true);
    try {
      await userApi.updateTariff(selected);
      await refetchUser(); // Обновляем данные пользователя
      alert('Тариф успешно обновлен!');
    } catch (error) {
      console.error('Error updating tariff:', error);
      alert('Ошибка при обновлении тарифа. Попробуйте еще раз.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container theme={themeObj}>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка тарифов...</div>
      </Container>
    );
  }

  return (
    <Container theme={themeObj}>
      <Title theme={themeObj}>Тарифы и оплата</Title>
      <TariffList>
        {tariffs.map(tariff => (
          <TariffCard
            key={tariff.id}
            selected={selected === tariff.id}
            theme={themeObj}
            onClick={() => handleTariffSelect(tariff.id)}
          >
            <TariffName theme={themeObj}>{tariff.name}</TariffName>
            <TariffPriceRow>
              <TariffPrice theme={themeObj}>{tariff.price} ₸</TariffPrice>
              <TariffPerMonth>в месяц</TariffPerMonth>
            </TariffPriceRow>
            {tariff.campaigns_limit > 0 && (
              <div style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
                До {tariff.campaigns_limit} кампаний
              </div>
            )}
          </TariffCard>
        ))}
      </TariffList>
      <PayButton 
        theme={themeObj} 
        disabled={!selected || updating}
        onClick={handlePayClick}
      >
        {updating ? 'Обновление...' : 'Выбрать тариф'}
      </PayButton>
      <BottomNavigation activeTab="/" />
    </Container>
  );
};

export default Tariffs;

// CSS для fadeInTariff
// @keyframes fadeInTariff { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } } 
