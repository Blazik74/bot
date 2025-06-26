import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Psychology as PsychologyIcon,
  Campaign as CampaignIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../contexts/ThemeContext';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeContext();

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <BottomNavigation
          value={location.pathname}
          onChange={handleChange}
          showLabels
        >
          <BottomNavigationAction
            label="Home"
            value="/"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="AI Center"
            value="/ai-center"
            icon={<PsychologyIcon />}
          />
          <BottomNavigationAction
            label="Targetolog"
            value="/targetolog"
            icon={<CampaignIcon />}
          />
          <BottomNavigationAction
            label="Profile"
            value="/profile"
            icon={<PersonIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BottomNavBar; 
