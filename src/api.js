import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://tg-miniapp-7li9.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // если нужны куки для авторизации
});

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Facebook Auth
export const facebookAuth = {
  getAuthUrl: () => api.get('/api/auth/facebook/url'),
  callback: (code) => api.post('/api/auth/facebook/callback', { code }),
  logout: () => api.post('/api/auth/logout'),
};

// User
export const userApi = {
  getProfile: () => api.get('/api/user/profile'),
  updateTariff: (tariffId) => api.put('/api/user/tariff', { tariff_id: tariffId }),
};

// Campaigns
export const campaignsApi = {
  getAll: () => api.get('/api/campaigns'),
  create: (campaignData) => api.post('/api/campaigns', campaignData),
  updateStatus: (campaignId, status) => 
    api.put(`/api/campaigns/${campaignId}/status`, { status }),
};

// Creatives
export const creativesApi = {
  getAll: () => api.get('/api/creatives'),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/creatives/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Autopilot
export const autopilotApi = {
  getStatus: () => api.get('/api/autopilot'),
  toggle: (enabled) => api.put('/api/autopilot', { enabled }),
};

// Tariffs
export const tariffsApi = {
  getAll: () => api.get('/api/tariffs'),
};

// AI Recommendations
export const aiApi = {
  getRecommendations: (campaignData) => 
    api.post('/api/ai/recommendations', campaignData),
};

// Auth helpers
export const authHelpers = {
  setAuthData: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getAuthData: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null,
    };
  },
  
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default api;
