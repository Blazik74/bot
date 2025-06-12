import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface User {
  id: string;
  username: string;
  avatar: string;
  tariff: 'freelancer' | 'company';
  facebookConnected: boolean;
}

interface AppState {
  // Тема
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  // Кампании
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Пользователь
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;

  // Автопилот
  isAutoPilotEnabled: boolean;
  toggleAutoPilot: () => void;

  // Уведомления
  notifications: {
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
  }[];
  addNotification: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  removeNotification: (index: number) => void;
}

export const useStore = create<AppState>()(
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