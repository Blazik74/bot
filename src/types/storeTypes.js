export interface Campaign {
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

export interface User {
  id: string;
  username: string;
  avatar: string;
  tariff: 'freelancer' | 'company';
  facebookConnected: boolean;
}

export interface AppState {
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
