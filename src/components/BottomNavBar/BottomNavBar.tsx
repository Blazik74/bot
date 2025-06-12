import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AiCenterIcon from '../../assets/icons/ai-center.svg';
import AiCenterActiveIcon from '../../assets/icons/ai-center-active.svg';
import TargetologIcon from '../../assets/icons/targetolog.svg';
import TargetologActiveIcon from '../../assets/icons/targetolog-active.svg';
import ProfileIcon from '../../assets/icons/profile.svg';
import ProfileActiveIcon from '../../assets/icons/profile-active.svg';

const navItems = [
  {
    label: 'ИИ центр',
    path: '/',
    icon: AiCenterIcon,
    iconActive: AiCenterActiveIcon,
  },
  {
    label: 'ИИ таргетолог',
    path: '/targetolog',
    icon: TargetologIcon,
    iconActive: TargetologActiveIcon,
  },
  {
    label: 'Профиль',
    path: '/profile',
    icon: ProfileIcon,
    iconActive: ProfileActiveIcon,
  },
];

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
        bgcolor: '#fff',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = isActive ? item.iconActive : item.icon;
        return (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              color: isActive ? '#005EFF' : '#8A8A8A',
              minWidth: 80,
            }}
          >
            <img src={Icon} alt={item.label} style={{ width: 34, height: 34 }} />
            <Typography
              sx={{
                fontSize: 13,
                mt: 0.5,
                color: isActive ? '#005EFF' : '#8A8A8A',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}; 