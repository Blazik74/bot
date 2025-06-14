import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  padding: 0 0 40px 0;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  text-align: left;
  margin: 40px 0 32px 16px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const TariffList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0 16px;
`;

const TariffCard = styled.div`
  background: ${({ selected, theme }) => selected ? (theme === 'dark' ? '#23272F' : '#fff') : '#E5E8EB'};
  border: 2px solid ${({ selected }) => selected ? '#005EFF' : 'transparent'};
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
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
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
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#181A1B'};
`;

const TariffPerMonth = styled.div`
  font-size: 15px;
  color: #888;
  margin-bottom: 2px;
`;

const PayButton = styled.button`
  width: 90%;
  max-width: 400px;
  background: #005EFF;
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
`;

const tariffs = [
  {
    id: 1,
    name: 'Фрилансер',
    price: '50 000',
    currency: '₸',
  },
  {
    id: 2,
    name: 'Компания',
    price: '80 000',
    currency: '₸',
  },
];

const Tariffs = () => {
  const [selected, setSelected] = useState(1);
  const theme = useTheme().theme || 'light';
  return (
    <Container theme={theme}>
      <Title theme={theme}>Тарифы и оплата</Title>
      <TariffList>
        {tariffs.map(tariff => (
          <TariffCard
            key={tariff.id}
            selected={selected === tariff.id}
            theme={theme}
            onClick={() => setSelected(tariff.id)}
          >
            <TariffName theme={theme}>{tariff.name}</TariffName>
            <TariffPriceRow>
              <TariffPrice theme={theme}>{tariff.currency}{tariff.price}</TariffPrice>
              <TariffPerMonth>в месяц</TariffPerMonth>
            </TariffPriceRow>
          </TariffCard>
        ))}
      </TariffList>
      <PayButton>Оплатить</PayButton>
    </Container>
  );
};

export default Tariffs; 
