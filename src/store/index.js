import { create } from 'zustand';
import { CAMPAIGN_STATUS, USER_TARIFF, THEME, NOTIFICATION_TYPE } from '../types/storeTypes';

/**
 * @type {import('../types/storeTypes').AppState}
 */
const useStore = create((set) => ({
  // Тема
  theme: THEME.LIGHT,
  setTheme: (theme) => set({ theme }),

  // Кампании
  campaigns: [],
  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    })),
  updateCampaign: (id, campaign) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...campaign } : c
      ),
    })),
  deleteCampaign: (id) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
    })),

  // Пользователь
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  // Автопилот
  isAutoPilotEnabled: false,
  toggleAutoPilot: () =>
    set((state) => ({
      isAutoPilotEnabled: !state.isAutoPilotEnabled,
    })),

  // Уведомления
  notifications: [],
  addNotification: (message, type) =>
    set((state) => ({
      notifications: [...state.notifications, { message, type }],
    })),
  removeNotification: (index) =>
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index),
    })),
}));

export default useStore; 