import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Тема
      theme: 'light',
      setTheme: (theme) => set({ theme }),

      // Кампании
      campaigns: [],
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [...state.campaigns, campaign] })),
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
      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),

      // Автопилот
      isAutoPilotEnabled: false,
      toggleAutoPilot: () =>
        set((state) => ({ isAutoPilotEnabled: !state.isAutoPilotEnabled })),

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
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        isAutoPilotEnabled: state.isAutoPilotEnabled,
      }),
    }
  )
); 
