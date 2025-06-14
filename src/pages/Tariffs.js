import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BottomNavigation } from '../components/BottomNavigation';

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 180px;
`;

const Title = styled.h1`
  font-size: 44px;
  font-weight: 800;
  text-align: left;
  margin: 32px 0 32px 0;
  padding-left: 24px;
  color: #181A1B;
`;

const TariffList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 0 32px 0;
`;

const TariffCard = styled(motion.div)`
  background: ${({ selected }) => selected ? '#fff' : '#E5E8EB'};
  border: 2px solid ${({ selected }) => selected ? '#005EFF' : 'transparent'};
  border-radius: 22px;
  padding: 32px 32px 24px 32px;
  box-shadow: ${({ selected }) => selected ? '0 2px 12px 0 rgba(0,94,255,0.08)' : 'none'};
  cursor: pointer;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background 0.2s, border 0.2s;
`;

const TariffName = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #181A1B;
`;
const TariffDesc = styled.div`
  font-size: 20px;
  color: #888;
  margin-top: 4px;
  margin-bottom: 18px;
`;
const TariffPriceRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;
const TariffPrice = styled.div`
  font-size: 38px;
  font-weight: 700;
  color: #181A1B;
`;
const TariffPerMonth = styled.div`
  font-size: 20px;
  color: #888;
  margin-bottom: 2px;
`;
const PayButton = styled.button`
  width: 90%;
  max-width: 400px;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 28px;
  font-weight: 600;
  padding: 22px 0;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0,94,255,0.08);
  margin: 0 auto;
  position: fixed;
  left: 0; right: 0; bottom: 110px;
  display: block;
  transition: background 0.2s;
`;
const Spacer = styled.div`
  height: 48px;
  width: 100%;
`;

const tariffs = [
  {
    id: 1,
    name: 'Фрилансер',
    desc: 'ограниченные функции',
    price: 0,
    currency: '₽',
  },
  {
    id: 2,
    name: 'Компания',
    desc: 'всё включено',
    price: 990,
    currency: '₽',
  },
];

const Tariffs = () => {
  const [selected, setSelected] = useState(1);
  return (
    <Container>
      <Title>Тарифы и оплата</Title>
      <TariffList>
        {tariffs.map((tariff, idx) => (
          <TariffCard
            key={tariff.id}
            selected={selected === tariff.id}
            onClick={() => setSelected(tariff.id)}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: selected === tariff.id ? 1.03 : 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              marginLeft: 24,
              marginRight: 24,
              borderColor: selected === tariff.id ? '#005EFF' : 'transparent',
              background: selected === tariff.id ? '#fff' : '#E5E8EB',
            }}
          >
            <TariffName>{tariff.name}</TariffName>
            <TariffDesc>{tariff.desc}</TariffDesc>
            <TariffPriceRow>
              <TariffPrice>{tariff.currency}{tariff.price}</TariffPrice>
              <TariffPerMonth>в месяц</TariffPerMonth>
            </TariffPriceRow>
          </TariffCard>
        ))}
      </TariffList>
      <PayButton>Оплатить</PayButton>
      <Spacer />
      <BottomNavigation />
    </Container>
  );
};

export default Tariffs;

// CSS для fadeInTariff
// @keyframes fadeInTariff { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } } 
