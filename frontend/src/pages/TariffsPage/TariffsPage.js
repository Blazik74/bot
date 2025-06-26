import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { api } from '../../api'; // Предполагается, что у вас есть настроенный api
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  marginBottom: theme.spacing(1),
}));

const Price = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

const FeatureList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const TariffsPage = () => {
  const { user } = useUser();
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        setLoading(true);
        // Предполагается, что есть эндпоинт для получения тарифов
        const response = await api.get('/tariffs/'); 
        // Фильтруем бесплатный тариф, чтобы он не отображался
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
      // Логика продления
      console.log('Renewing', tariff.name);
    } else if (action === 'upgrade') {
      console.log('Upgrading to', tariff.name);
      tg?.sendData(JSON.stringify({ command: 'upgrade_tariff', tariff_id: tariff.id }));
    } else if (action === 'downgrade') {
      console.log('Downgrading to', tariff.name);
      tg?.sendData(JSON.stringify({ command: 'downgrade_tariff', tariff_id: tariff.id }));
    } else {
      // Логика выбора нового тарифа
      console.log('Selecting', tariff.name);
    }
     // Можно добавить tg.close() если нужно закрыть приложение
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom>
          Выберите ваш план
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Подберите идеальный тариф для вашего бизнеса
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
        {tariffs.map((tariff) => {
          const { text } = getButtonState(tariff);
          return (
            <StyledCard key={tariff.id}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {tariff.name}
                </Typography>
                <Price>
                  {tariff.price}₽
                  <Typography component="span" variant="subtitle1" color="text.secondary">
                    /месяц
                  </Typography>
                </Price>

                <FeatureList>
                  {tariff.features && Object.entries(tariff.features).map(([key, value]) => (
                    value && <ListItem key={key} disableGutters>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" />
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
                  sx={{ mt: 'auto' }}
                >
                  {text}
                </Button>
              </CardContent>
            </StyledCard>
          );
        })}
      </Box>

      <Box mt={6} p={4} bgcolor="background.paper" borderRadius={2}>
        <Typography variant="h5" gutterBottom>
          All Plans Include
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enterprise-grade security and data protection
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Updates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regular updates and new features
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              24/7 customer support via email
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}; 
