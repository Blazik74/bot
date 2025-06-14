/**
 * @typedef {Object} CampaignStats
 * @property {number} clicks - Количество кликов
 * @property {number} impressions - Количество показов
 * @property {number} ctr - Click-through rate
 * @property {number} cpc - Cost per click
 * @property {number} cpm - Cost per mille
 */

/**
 * @typedef {Object} Campaign
 * @property {string} id - Уникальный идентификатор кампании
 * @property {string} name - Название кампании
 * @property {('active'|'paused')} status - Статус кампании
 * @property {CampaignStats} stats - Статистика кампании
 */

/**
 * @typedef {Object} User
 * @property {string} id - Уникальный идентификатор пользователя
 * @property {string} username - Имя пользователя
 * @property {string} avatar - URL аватара пользователя
 * @property {('freelancer'|'company')} tariff - Тариф пользователя
 * @property {boolean} facebookConnected - Статус подключения Facebook
 */

/**
 * @typedef {Object} Notification
 * @property {string} message - Текст уведомления
 * @property {('info'|'success'|'error'|'warning')} type - Тип уведомления
 */

/**
 * @typedef {Object} AppState
 * @property {('light'|'dark')} theme - Текущая тема приложения
 * @property {function('light'|'dark'): void} setTheme - Функция для изменения темы
 * @property {Campaign[]} campaigns - Список кампаний
 * @property {function(Campaign): void} addCampaign - Функция для добавления кампании
 * @property {function(string, Partial<Campaign>): void} updateCampaign - Функция для обновления кампании
 * @property {function(string): void} deleteCampaign - Функция для удаления кампании
 * @property {User|null} user - Данные текущего пользователя
 * @property {function(User|null): void} setUser - Функция для установки пользователя
 * @property {function(Partial<User>): void} updateUser - Функция для обновления данных пользователя
 * @property {boolean} isAutoPilotEnabled - Статус автопилота
 * @property {function(): void} toggleAutoPilot - Функция для переключения автопилота
 * @property {Notification[]} notifications - Список уведомлений
 * @property {function(string, 'info'|'success'|'error'|'warning'): void} addNotification - Функция для добавления уведомления
 * @property {function(number): void} removeNotification - Функция для удаления уведомления
 */

// Константы для типов
export const CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
};

export const USER_TARIFF = {
  FREELANCER: 'freelancer',
  COMPANY: 'company',
};

export const NOTIFICATION_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
}; 
