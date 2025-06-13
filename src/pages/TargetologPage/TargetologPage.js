import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const initialCampaigns = [
  {
    id: 1,
    name: 'Summer Sale',
    status: 'active',
    budget: 1000,
    spent: 450,
    impressions: 15000,
    clicks: 750,
    conversions: 45,
  },
  {
    id: 2,
    name: 'New Collection',
    status: 'paused',
    budget: 2000,
    spent: 1200,
    impressions: 25000,
    clicks: 1200,
    conversions: 80,
  },
];

export const TargetologPage = () => {
  const theme = useStore((state) => state.theme);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
  });

  const handleOpenDialog = (campaign = null) => {
    if (campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        name: campaign.name,
        budget: campaign.budget,
      });
    } else {
      setSelectedCampaign(null);
      setFormData({
        name: '',
        budget: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCampaign(null);
    setFormData({
      name: '',
      budget: '',
    });
  };

  const handleSaveCampaign = () => {
    if (selectedCampaign) {
      setCampaigns(
        campaigns.map((campaign) =>
          campaign.id === selectedCampaign.id
            ? {
                ...campaign,
                name: formData.name,
                budget: Number(formData.budget),
              }
            : campaign
        )
      );
    } else {
      setCampaigns([
        ...campaigns,
        {
          id: campaigns.length + 1,
          name: formData.name,
          status: 'active',
          budget: Number(formData.budget),
          spent: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
        },
      ]);
    }
    handleCloseDialog();
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== id));
  };

  const handleToggleStatus = (id) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === id
          ? {
              ...campaign,
              status: campaign.status === 'active' ? 'paused' : 'active',
            }
          : campaign
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} key={campaign.id}>
            <StyledCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6">{campaign.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(campaign)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Chip
                  label={campaign.status}
                  color={campaign.status === 'active' ? 'success' : 'default'}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Budget
                    </Typography>
                    <Typography variant="h6">${campaign.budget}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Spent
                    </Typography>
                    <Typography variant="h6">${campaign.spent}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Impressions
                    </Typography>
                    <Typography variant="body1">{campaign.impressions}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Clicks
                    </Typography>
                    <Typography variant="body1">{campaign.clicks}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Conversions
                    </Typography>
                    <Typography variant="body1">{campaign.conversions}</Typography>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color={campaign.status === 'active' ? 'error' : 'success'}
                    fullWidth
                    onClick={() => handleToggleStatus(campaign.id)}
                  >
                    {campaign.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedCampaign ? 'Edit Campaign' : 'New Campaign'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCampaign} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}; 
