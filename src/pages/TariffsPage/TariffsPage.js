import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../../store';
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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

const tariffs = [
  {
    id: 'freelancer',
    name: 'Freelancer',
    price: 49,
    features: [
      'Up to 5 campaigns',
      'Basic analytics',
      'Email support',
      'Facebook integration',
    ],
  },
  {
    id: 'company',
    name: 'Company',
    price: 149,
    features: [
      'Unlimited campaigns',
      'Advanced analytics',
      'Priority support',
      'All platform integrations',
      'Custom reporting',
      'API access',
    ],
  },
];

export const TariffsPage = () => {
  const theme = useStore((state) => state.theme);
  const user = useStore((state) => state.user);
  const updateUser = useStore((state) => state.updateUser);

  const handleSelectTariff = (tariffId) => {
    if (user) {
      updateUser({ tariff: tariffId });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Select the perfect plan for your business needs
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
        {tariffs.map((tariff) => (
          <StyledCard key={tariff.id}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {tariff.name}
              </Typography>
              <Price>
                ${tariff.price}
                <Typography component="span" variant="subtitle1" color="text.secondary">
                  /month
                </Typography>
              </Price>

              <FeatureList>
                {tariff.features.map((feature, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </FeatureList>

              <Button
                variant={user?.tariff === tariff.id ? 'outlined' : 'contained'}
                color={user?.tariff === tariff.id ? 'default' : 'primary'}
                fullWidth
                size="large"
                onClick={() => handleSelectTariff(tariff.id)}
                disabled={user?.tariff === tariff.id}
                sx={{ mt: 'auto' }}
              >
                {user?.tariff === tariff.id ? 'Current Plan' : 'Select Plan'}
              </Button>
            </CardContent>
          </StyledCard>
        ))}
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
