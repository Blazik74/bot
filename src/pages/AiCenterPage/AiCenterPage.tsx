import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import {
  Campaign as TargetologIcon,
  Psychology as FutureIcon1,
  AutoGraph as FutureIcon2,
  SmartToy as FutureIcon3,
} from '@mui/icons-material';

const PageContainer = styled(Box)({
  padding: '20px',
  paddingBottom: '100px',
});

const Title = styled('h1')({
  fontSize: '24px',
  marginBottom: '30px',
  color: '#1976d2',
});

const GridContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  marginBottom: '30px',
});

const ServiceCard = styled(motion.div)<{ disabled?: boolean }>(({ disabled }) => ({
  backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.7 : 1,
}));

const ServiceIcon = styled(Box)({
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '40px',
    color: '#1976d2',
  },
});

const ServiceName = styled('span')({
  fontSize: '16px',
  fontWeight: 500,
  textAlign: 'center',
});

const TariffButton = styled(Button)({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
});

const services = [
  {
    icon: TargetologIcon,
    name: 'ИИ Таргетолог',
    path: '/targetolog',
    disabled: false,
  },
  {
    icon: FutureIcon1,
    name: 'Скоро',
    disabled: true,
  },
  {
    icon: FutureIcon2,
    name: 'Скоро',
    disabled: true,
  },
  {
    icon: FutureIcon3,
    name: 'Скоро',
    disabled: true,
  },
];

export const AiCenterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Title>ИИ Центр</Title>
      
      <GridContainer>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            disabled={service.disabled}
            whileTap={{ scale: service.disabled ? 1 : 0.95 }}
            onClick={() => !service.disabled && service.path && navigate(service.path)}
          >
            <ServiceIcon>
              <service.icon />
            </ServiceIcon>
            <ServiceName>{service.name}</ServiceName>
          </ServiceCard>
        ))}
      </GridContainer>

      <TariffButton
        variant="contained"
        color="primary"
        onClick={() => navigate('/tariffs')}
      >
        Тарифы и оплата
      </TariffButton>
    </PageContainer>
  );
}; 