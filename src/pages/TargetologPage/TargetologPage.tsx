import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  PowerSettingsNew as PowerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const PageContainer = styled(Box)({
  padding: '20px',
  paddingBottom: '100px',
});

const UploadSection = styled(Box)({
  marginBottom: '30px',
});

const UploadButton = styled(Button)({
  width: '100%',
  height: '120px',
  border: '2px dashed #ccc',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  '&:hover': {
    borderColor: '#1976d2',
  },
});

const CampaignButton = styled(Button)({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  marginBottom: '30px',
});

const Modal = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

const ModalContent = styled(motion.div)({
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflowY: 'auto',
});

const CloseButton = styled(Button)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  minWidth: 'auto',
  padding: '8px',
});

const FormGroup = styled(Box)({
  marginBottom: '20px',
});

const Label = styled(Typography)({
  marginBottom: '8px',
  fontWeight: 500,
});

const StatsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '15px',
  marginBottom: '30px',
});

const StatCard = styled(Box)({
  backgroundColor: '#f5f5f5',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center',
});

const CampaignList = styled(Box)({
  marginTop: '30px',
});

const CampaignCard = styled(Box)({
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '15px',
});

const AutoPilotSection = styled(Box)({
  marginTop: '30px',
  padding: '15px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
});

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused';
  stats: {
    clicks: number;
    impressions: number;
    ctr: number;
    cpc: number;
    cpm: number;
  };
}

export const TargetologPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isAutoPilotEnabled, setIsAutoPilotEnabled] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setSelectedFile(file);
    }
  };

  const handleStartCampaign = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
  };

  const handleToggleAutoPilot = () => {
    setIsAutoPilotEnabled(!isAutoPilotEnabled);
  };

  return (
    <PageContainer>
      <UploadSection>
        <input
          type="file"
          accept="video/mp4,video/quicktime,image/png"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <UploadButton component="span">
            <UploadIcon sx={{ fontSize: 40 }} />
            <Typography>Выбрать файл</Typography>
            {selectedFile && (
              <Typography variant="caption">{selectedFile.name}</Typography>
            )}
          </UploadButton>
        </label>
      </UploadSection>

      <CampaignButton
        variant="contained"
        color="primary"
        onClick={handleStartCampaign}
        disabled={!selectedFile}
      >
        Запустить кампанию
      </CampaignButton>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <CloseButton onClick={handleCloseModal}>
                <CloseIcon />
              </CloseButton>

              <Typography variant="h6" gutterBottom>
                Что вы хотите получить?
              </Typography>

              <FormGroup>
                <Label>Геолокация</Label>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Казахстан
                </Button>
              </FormGroup>

              <FormGroup>
                <Label>Бюджет (в $)</Label>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  От $1
                </Button>
              </FormGroup>

              <FormGroup>
                <Label>Период</Label>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <DatePicker
                      label="Начало"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      minDate={new Date()}
                      maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                    />
                    <DatePicker
                      label="Конец"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      minDate={startDate || new Date()}
                      maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TimePicker
                      label="Время начала"
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                    />
                    <TimePicker
                      label="Время окончания"
                      value={endTime}
                      onChange={(newValue) => setEndTime(newValue)}
                    />
                  </Box>
                </LocalizationProvider>
              </FormGroup>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCloseModal}
              >
                Запустить
              </Button>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      {campaigns.length > 0 && (
        <>
          <StatsGrid>
            <StatCard>
              <Typography variant="h6">Клики</Typography>
              <Typography>0</Typography>
            </StatCard>
            <StatCard>
              <Typography variant="h6">Показы</Typography>
              <Typography>0</Typography>
            </StatCard>
            <StatCard>
              <Typography variant="h6">CTR</Typography>
              <Typography>0%</Typography>
            </StatCard>
            <StatCard>
              <Typography variant="h6">CPC</Typography>
              <Typography>$0</Typography>
            </StatCard>
            <StatCard>
              <Typography variant="h6">CPM</Typography>
              <Typography>$0</Typography>
            </StatCard>
          </StatsGrid>

          <CampaignList>
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{campaign.name}</Typography>
                  <Button
                    onClick={() => handleToggleCampaign(campaign.id)}
                    color={campaign.status === 'active' ? 'error' : 'primary'}
                  >
                    {campaign.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Typography>Клики: {campaign.stats.clicks}</Typography>
                  <Typography>Показы: {campaign.stats.impressions}</Typography>
                  <Typography>CTR: {campaign.stats.ctr}%</Typography>
                </Box>
              </CampaignCard>
            ))}
          </CampaignList>
        </>
      )}

      <AutoPilotSection>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">ИИ Автопилот</Typography>
          <Button
            onClick={handleToggleAutoPilot}
            color={isAutoPilotEnabled ? 'error' : 'primary'}
            startIcon={<PowerIcon />}
          >
            {isAutoPilotEnabled ? 'Выключить' : 'Включить'}
          </Button>
        </Box>
        {isAutoPilotEnabled && (
          <>
            <Button
              fullWidth
              startIcon={<RefreshIcon />}
              sx={{ mb: 2 }}
            >
              Обновить советы
            </Button>
            <Typography variant="body2" color="text.secondary">
              Советы от ИИ появятся здесь
            </Typography>
          </>
        )}
      </AutoPilotSection>
    </PageContainer>
  );
}; 