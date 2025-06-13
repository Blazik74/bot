import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme === 'dark' ? '#181A1B' : '#fff'};
  padding: 32px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#222'};
`;

const TariffLink = styled.a`
  display: block;
  color: #005EFF;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 18px;
  text-decoration: underline;
  cursor: pointer;
`;

const TariffCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 2px solid #E5E8EB;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    border-color: #005EFF;
    transform: translateY(-2px);
  }
`;

const TariffTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #222;
`;

const TariffPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #005EFF;
  margin-bottom: 16px;
`;

const TariffDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const TariffFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
`;

const TariffFeature = styled.li`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  &:before {
    content: "✓";
    color: #005EFF;
    margin-right: 8px;
  }
`;

const TariffButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background: #005EFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #0046CC;
  }
`;

const Tariffs = () => {
  const [selectedTariff, setSelectedTariff] = useState(null);
  const theme = useTheme().theme || 'light';

  const tariffs = [
    {
      id: 1,
      title: "Базовый",
      price: "5 000 ₸",
      description: "Для начинающих",
      features: [
        "До 5 кампаний",
        "Базовые метрики",
        "Email поддержка"
      ]
    },
    {
      id: 2,
      title: "Про",
      price: "15 000 ₸",
      description: "Для профессионалов",
      features: [
        "До 20 кампаний",
        "Расширенные метрики",
        "Приоритетная поддержка",
        "API доступ"
      ]
    },
    {
      id: 3,
      title: "Бизнес",
      price: "50 000 ₸",
      description: "Для компаний",
      features: [
        "Неограниченное количество кампаний",
        "Все метрики",
        "24/7 поддержка",
        "API доступ",
        "Персональный менеджер"
      ]
    }
  ];

  return (
    <Container theme={theme}>
      <TariffLink href="#">Тарифы и оплата</TariffLink>
      <Title theme={theme}>Тарифы и оплата</Title>
      {tariffs.map(tariff => (
        <TariffCard
          key={tariff.id}
          onClick={() => setSelectedTariff(tariff.id)}
          style={{
            borderColor: selectedTariff === tariff.id ? "#005EFF" : "#E5E8EB",
            transform: selectedTariff === tariff.id ? "translateY(-2px)" : "none"
          }}
        >
          <TariffTitle>{tariff.title}</TariffTitle>
          <TariffPrice>{tariff.price}</TariffPrice>
          <TariffDescription>{tariff.description}</TariffDescription>
          <TariffFeatures>
            {tariff.features.map((feature, index) => (
              <TariffFeature key={index}>{feature}</TariffFeature>
            ))}
          </TariffFeatures>
          <TariffButton>Оплатить</TariffButton>
        </TariffCard>
      ))}
    </Container>
  );
};

export default Tariffs; 