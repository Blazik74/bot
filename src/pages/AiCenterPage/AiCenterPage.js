import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

import TargetologIcon from '../../assets/icons/targetolog-active.svg';
import BuhgalterIcon from '../../assets/icons/buhgalter.svg';
import ProdavecIcon from '../../assets/icons/prodavec.svg';
import KonsultantIcon from '../../assets/icons/konsultant.svg';

export const AiCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const services = [
    {
      name: 'ИИ Таргетолог',
      icon: TargetologIcon,
      active: true,
      soon: false,
      onClick: () => navigate('/targetolog'),
    },
    {
      name: 'ИИ Бухгалтер',
      icon: BuhgalterIcon,
      active: false,
      soon: true,
    },
    {
      name: 'ИИ Продавец',
      icon: ProdavecIcon,
      active: false,
      soon: true,
    },
    {
      name: 'ИИ Консультант',
      icon: KonsultantIcon,
      active: false,
      soon: true,
    },
  ];

  return (
    <Box
      sx={{
        width: 360,
        minHeight: 800,
        mx: 'auto',
        bgcolor: '#fff',
        color: '#181A20',
        fontFamily: 'inherit',
        position: 'relative',
        pb: 10,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mt: 5, mb: 3, letterSpacing: 1 }}
      >
        ИИ Центр
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={2} sx={{ px: 2 }}>
        {services.map((s, i) => (
          <Box
            key={s.name}
            onClick={s.active ? s.onClick : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#fff',
              border: '2px solid #D1D5DB',
              borderRadius: 3,
              px: 2,
              py: 1.5,
              cursor: s.active ? 'pointer' : 'default',
              opacity: s.active ? 1 : 0.7,
              position: 'relative',
            }}
          >
            <Box sx={{ mr: 2, width: 41, height: 41 }}>
              <img src={s.icon} alt={s.name} style={{ width: 41, height: 41 }} />
            </Box>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 500,
                color: s.active ? '#181A20' : '#949CA9',
              }}
            >
              {s.name}
            </Typography>
            {s.soon && (
              <Typography
                sx={{
                  ml: 'auto',
                  color: '#949CA9',
                  fontSize: 16,
                  position: 'absolute',
                  right: 16,
                  bottom: 10,
                }}
              >
                будет скоро
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
      {/* Кнопка тарифов */}
      <Box sx={{ position: 'fixed', left: 0, right: 0, bottom: 70, textAlign: 'center' }}>
        <Button
          variant="text"
          sx={{
            color: '#005EFF',
            fontSize: 18,
            fontWeight: 500,
          }}
          onClick={() => navigate('/tariffs')}
        >
          Тарифы и оплата
        </Button>
      </Box>
    </Box>
  );
}; 
