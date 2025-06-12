import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { Check as CheckIcon } from '@mui/icons-material';

const PageContainer = styled(Box)({
  padding: '20px',
  paddingBottom: '100px',
});

const Title = styled(Typography)({
  fontSize: '24px',
  marginBottom: '30px',
  textAlign: 'center',
});

const TariffContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginBottom: '30px',
});

const TariffCard = styled(motion.div)<{ selected?: boolean }>(({ selected }) => ({
  backgroundColor: selected ? '#1976d2' : '#ffffff',
  color: selected ? '#ffffff' : '#000000',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
}));

const TariffHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
});

const TariffName = styled(Typography)({
  fontSize: '20px',
  fontWeight: 500,
});

const TariffPrice = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
});

const TariffFeatures = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const Feature = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const PayButton = styled(Button)({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
});

type Tariff = {
  id: string;
  name: string;
  price: number;
  features: string[];
};

const tariffs: Tariff[] = [
  {
    id: 'freelancer',
    name: 'Фрилансер',
    price: 50000,
    features: [
      'До 5 рекламных кампаний',
      'Базовые аналитики',
      'Поддержка по email',
    ],
  },
  {
    id: 'company',
    name: 'Компания',
    price: 80000,
    features: [
      'Неограниченное количество кампаний',
      'Расширенная аналитика',
      'Приоритетная поддержка',
      'ИИ автопилот',
    ],
  },
];

export const TariffsPage: React.FC = () => {
  const [selectedTariff, setSelectedTariff] = useState<string>('freelancer');

  const handleTariffSelect = (tariffId: string) => {
    setSelectedTariff(tariffId);
  };

  const handlePayment = () => {
    // Здесь будет логика оплаты
    console.log('Оплата тарифа:', selectedTariff);
  };

  return (
    <PageContainer>
      <Title>Тарифы и оплата</Title>

      <TariffContainer>
        <AnimatePresence mode="wait">
          {tariffs.map((tariff) => (
            <TariffCard
              key={tariff.id}
              selected={selectedTariff === tariff.id}
              onClick={() => handleTariffSelect(tariff.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TariffHeader>
                <TariffName>{tariff.name}</TariffName>
                <TariffPrice>{tariff.price} ₸/мес</TariffPrice>
              </TariffHeader>

              <TariffFeatures>
                {tariff.features.map((feature, index) => (
                  <Feature key={index}>
                    <CheckIcon />
                    <Typography>{feature}</Typography>
                  </Feature>
                ))}
              </TariffFeatures>
            </TariffCard>
          ))}
        </AnimatePresence>
      </TariffContainer>

      <PayButton
        variant="contained"
        color="primary"
        onClick={handlePayment}
      >
        Оплатить
      </PayButton>
    </PageContainer>
  );
}; 