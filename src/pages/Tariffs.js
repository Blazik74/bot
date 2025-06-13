import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import useStore from '../store';

const tariffs = [
  {
    id: 'freelancer',
    name: 'Фрилансер',
    price: 50000,
    description: 'ограниченные функции',
    included: false,
  },
  {
    id: 'company',
    name: 'Компания',
    price: 80000,
    description: 'всё включено',
    included: true,
  },
];

const Container = styled.div`
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 32px 0;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 32px 0 24px 0;
  text-align: left;
  width: 100%;
  max-width: 420px;
`;

const TariffList = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const TariffCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ selected }) => (selected ? '#fff' : '#F3F4F6')};
  border: 2px solid ${({ selected }) => (selected ? '#005EFF' : 'transparent')};
  border-radius: 12px;
  padding: 18px 20px;
  cursor: pointer;
  transition: border 0.2s, background 0.2s;
  box-shadow: none;
  position: relative;
`;

const TariffInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TariffName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 2px;
`;

const TariffDesc = styled.div`
  font-size: 13px;
  color: #949CA9;
`;

const TariffPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Price = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #222;
`;

const PerMonth = styled.div`
  font-size: 13px;
  color: #949CA9;
`;

const PayButton = styled.button`
  width: 100%;
  max-width: 420px;
  margin-top: 24px;
  padding: 14px 0;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:active {
    background: #0047c2;
  }
`;

export const Tariffs = () => {
  const theme = useStore((state) => state.theme);
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);
  const [selected, setSelected] = useState('freelancer');

  const handleSelectTariff = (tariffId) => {
    if (user) {
      updateUser({ tariff: tariffId });
    }
  };

  return (
    <Container>
      <Title>Тарифы и оплата</Title>
      <TariffList>
        {tariffs.map((tariff) => (
          <TariffCard
            key={tariff.id}
            selected={selected === tariff.id}
            onClick={() => setSelected(tariff.id)}
          >
            <TariffInfo>
              <TariffName>{tariff.name}</TariffName>
              <TariffDesc>{tariff.description}</TariffDesc>
            </TariffInfo>
            <TariffPrice>
              <Price>
                ₸{tariff.price.toLocaleString('ru-RU')}
              </Price>
              <PerMonth>в месяц</PerMonth>
            </TariffPrice>
          </TariffCard>
        ))}
      </TariffList>
      <PayButton>Оплатить</PayButton>
    </Container>
  );
}; 
