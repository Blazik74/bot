import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const NotificationContainer = styled(motion.div)({
  position: 'fixed',
  top: '20px',
  right: '20px',
  zIndex: 2000,
});

const NotificationContent = styled(Box)<{ type: 'info' | 'success' | 'error' | 'warning' }>(
  ({ type }) => ({
    backgroundColor: type === 'info' ? '#1976d2' :
                   type === 'success' ? '#2e7d32' :
                   type === 'error' ? '#d32f2f' :
                   '#ed6c02',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    minWidth: '300px',
    maxWidth: '400px',
  })
);

const IconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    fontSize: '24px',
  },
});

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

interface NotificationProps {
  message: string;
  type: NotificationType;
  isVisible: boolean;
  onClose: () => void;
}

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'info':
      return <InfoIcon />;
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
  }
};

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationContainer
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <NotificationContent type={type}>
            <IconWrapper>
              {getIcon(type)}
            </IconWrapper>
            <Typography>{message}</Typography>
          </NotificationContent>
        </NotificationContainer>
      )}
    </AnimatePresence>
  );
}; 