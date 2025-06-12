import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { 
  SmartToy as AiIcon,
  Campaign as TargetologIcon,
  Person as ProfileIcon 
} from '@mui/icons-material';

const NavContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: '80px',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '0 20px',
  zIndex: 1000,
}));

const NavItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  color: '#666666',
  '&.active': {
    color: '#1976d2',
  },
}));

const NavText = styled('span')({
  fontSize: '12px',
  marginTop: '4px',
});

const navItems = [
  { path: '/', icon: AiIcon, label: 'ИИ Центр' },
  { path: '/targetolog', icon: TargetologIcon, label: 'Таргетолог' },
  { path: '/profile', icon: ProfileIcon, label: 'Профиль' },
];

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <NavContainer>
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <NavItem
            key={path}
            className={isActive ? 'active' : ''}
            onClick={() => navigate(path)}
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              animate={{ color: isActive ? '#1976d2' : '#666666' }}
            >
              <Icon sx={{ fontSize: 28 }} />
            </motion.div>
            <NavText>{label}</NavText>
          </NavItem>
        );
      })}
    </NavContainer>
  );
}; 