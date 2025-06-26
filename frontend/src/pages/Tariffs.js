import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { api } from '../api';
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useThemeContext, themes } from '../contexts/ThemeContext';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const Price = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const FeatureList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Tariffs = () => {
  const { user } = useUser();
  const { theme } = useThemeContext();
  const themeObj = themes[theme] || themes.light;

  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tariffs/');
        setTariffs(response.data.filter(t => t.name !== 'Бесплатный'));
      } catch (error) {
        console.error("Failed to fetch tariffs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTariffs();
  }, []);

  const getButtonState = (tariff) => {
    const userTariffName = user?.tariff?.name;
    if (userTariffName === tariff.name) {
      return { text: 'Продлить', action: 'renew' };
    }
    if (userTariffName === 'Фрилансер' && tariff.name === 'Компания') {
      return { text: 'Улучшить', action: 'upgrade' };
    }
    if (userTariffName === 'Компания' && tariff.name === 'Фрилансер') {
      return { text: 'Перейти', action: 'downgrade' };
    }
    return { text: 'Выбрать', action: 'select' };
  };

  const handleButtonClick = (tariff) => {
    const { action } = getButtonState(tariff);
    const tg = window.Telegram?.WebApp;
    if (action === 'renew') {
      console.log('Renewing', tariff.name);
    } else if (action === 'upgrade') {
      console.log('Upgrading to', tariff.name);
      tg?.sendData(JSON.stringify({ command: 'upgrade_tariff', tariff_id: tariff.id }));
    } else if (action === 'downgrade') {
      console.log('Downgrading to', tariff.name);
      tg?.sendData(JSON.stringify({ command: 'downgrade_tariff', tariff_id: tariff.id }));
    } else {
      console.log('Selecting', tariff.name);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" sx={{ background: themeObj.background }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, background: themeObj.background, color: themeObj.text, minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" gutterBottom>
            Выберите ваш план
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ color: themeObj.text }}>
            Подберите идеальный тариф для вашего бизнеса
          </Typography>
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
          {tariffs.map((tariff) => {
            const { text } = getButtonState(tariff);
            return (
              <StyledCard key={tariff.id} theme={{ palette: { background: { paper: themeObj.card }, text: { primary: themeObj.text } }, ...theme } }>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {tariff.name}
                  </Typography>
                  <Price theme={{ palette: { text: { primary: themeObj.text } } }}>
                    {tariff.price}₽
                    <Typography component="span" variant="subtitle1" color="text.secondary" sx={{ color: themeObj.text }}>
                      /месяц
                    </Typography>
                  </Price>

                  <FeatureList>
                    {tariff.features && Object.entries(tariff.features).map(([key, value]) => (
                      value && <ListItem key={key} disableGutters>
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: themeObj.primary }} />
                        </ListItemIcon>
                        <ListItemText primary={key.replace(/_/g, ' ')} />
                      </ListItem>
                    ))}
                  </FeatureList>

                  <Button
                    variant={user?.tariff?.name === tariff.name ? 'outlined' : 'contained'}
                    fullWidth
                    size="large"
                    onClick={() => handleButtonClick(tariff)}
                    sx={{ mt: 'auto',
                          borderColor: themeObj.primary, 
                          color: user?.tariff?.name === tariff.name ? themeObj.primary : 'white',
                          backgroundColor: user?.tariff?.name === tariff.name ? 'transparent' : themeObj.primary
                        }}
                  >
                    {text}
                  </Button>
                </CardContent>
              </StyledCard>
            );
          })}
        </Box>
      </motion.div>
    </Box>
  );
};

export default Tariffs;

// CSS для fadeInTariff
// @keyframes fadeInTariff { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } } 
