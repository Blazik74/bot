import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../../store';
import { Box, Typography, Button, Switch, Avatar, Select, MenuItem } from '@mui/material';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(3),
}));

const StatBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
}));

export const ProfilePage = () => {
  const theme = useStore((state) => state.theme);
  const user = useStore((state) => state.user);
  const setTheme = useStore((state) => state.setTheme);
  const updateUser = useStore((state) => state.updateUser);

  const handleFacebookConnect = () => {
    if (user) {
      updateUser({ facebookConnected: !user.facebookConnected });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledBox>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar
            src={user?.avatar || 'https://via.placeholder.com/80'}
            alt="Profile"
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h4" gutterBottom>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user?.tariff === 'company' ? 'Company Plan' : 'Freelancer Plan'}
            </Typography>
          </Box>
        </Box>
      </StyledBox>

      <StyledBox>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle1">Тема</Typography>
            <Typography variant="body2" color="text.secondary">
              Выберите светлую или тёмную тему
            </Typography>
          </Box>
          <Select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="light">Светлая</MenuItem>
            <MenuItem value="dark">Тёмная</MenuItem>
          </Select>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1">Facebook Integration</Typography>
            <Typography variant="body2" color="text.secondary">
              Connect your Facebook account
            </Typography>
          </Box>
          <Button
            variant={user?.facebookConnected ? 'contained' : 'outlined'}
            color={user?.facebookConnected ? 'success' : 'primary'}
            onClick={handleFacebookConnect}
          >
            {user?.facebookConnected ? 'Connected' : 'Connect'}
          </Button>
        </Box>
      </StyledBox>

      <StyledBox>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          <StatBox>
            <Typography variant="h4" gutterBottom>
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Campaigns
            </Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" gutterBottom>
              8
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Campaigns
            </Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" gutterBottom>
              $1,234
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Spend
            </Typography>
          </StatBox>
          <StatBox>
            <Typography variant="h4" gutterBottom>
              245%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ROI
            </Typography>
          </StatBox>
        </Box>
      </StyledBox>

      <Button
        variant="contained"
        color="error"
        fullWidth
        size="large"
        sx={{ mt: 2 }}
      >
        Sign Out
      </Button>
    </motion.div>
  );
}; 
