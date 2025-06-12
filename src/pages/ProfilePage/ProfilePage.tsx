import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ContentCopy as CopyIcon,
  Facebook as FacebookIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material';

const PageContainer = styled(Box)({
  padding: '20px',
  paddingBottom: '100px',
});

const Title = styled(Typography)({
  fontSize: '24px',
  marginBottom: '30px',
});

const ProfileSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '30px',
});

const Avatar = styled(Box)({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  backgroundColor: '#1976d2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '15px',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const Username = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const SettingsSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

const SettingItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const ThemeSelector = styled(motion.div)({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  zIndex: 1000,
});

const ThemeOption = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showCopied, setShowCopied] = useState(false);

  const handleThemeToggle = () => {
    setIsThemeOpen(!isThemeOpen);
  };

  const handleThemeSelect = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setIsThemeOpen(false);
  };

  const handleUsernameClick = () => {
    navigator.clipboard.writeText('username123');
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <PageContainer>
      <Title>Профиль</Title>

      <ProfileSection>
        <Avatar>
          <img src="/default-avatar.png" alt="Avatar" />
        </Avatar>
        <Username onClick={handleUsernameClick}>
          <Typography>username123</Typography>
          <CopyIcon />
        </Username>
        {showCopied && (
          <Typography color="primary" variant="caption">
            Ваш ник скопирован
          </Typography>
        )}
      </ProfileSection>

      <SettingsSection>
        <SettingItem onClick={handleThemeToggle}>
          <Typography>Тема</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography>{theme === 'light' ? 'Светлая' : 'Темная'}</Typography>
            {theme === 'light' ? <LightIcon /> : <DarkIcon />}
          </Box>
        </SettingItem>

        <AnimatePresence>
          {isThemeOpen && (
            <ThemeSelector
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ThemeOption onClick={() => handleThemeSelect('light')}>
                <LightIcon />
                <Typography>Светлая</Typography>
              </ThemeOption>
              <ThemeOption onClick={() => handleThemeSelect('dark')}>
                <DarkIcon />
                <Typography>Темная</Typography>
              </ThemeOption>
            </ThemeSelector>
          )}
        </AnimatePresence>

        <SettingItem onClick={() => navigate('/tariffs')}>
          <Typography>Тариф</Typography>
          <Typography color="primary">Фрилансер</Typography>
        </SettingItem>

        <SettingItem>
          <Typography>Войти в аккаунт Facebook</Typography>
          <FacebookIcon />
        </SettingItem>
      </SettingsSection>
    </PageContainer>
  );
}; 