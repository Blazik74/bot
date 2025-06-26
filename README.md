# Telegram Mini App - Facebook Ads Manager

Приложение для управления рекламными кампаниями Facebook через Telegram Mini App.

## 🚀 Быстрый старт

### Предварительные требования

1. **Facebook App** - создайте приложение на [Facebook Developers](https://developers.facebook.com/)
2. **Node.js** (версия 16+) и **npm**
3. **Python** (версия 3.8+)

### Настройка Facebook App

1. Перейдите на [Facebook Developers](https://developers.facebook.com/)
2. Создайте новое приложение
3. Добавьте продукт "Facebook Login"
4. В настройках Facebook Login укажите:
   - **Valid OAuth Redirect URIs**: `http://localhost:8000/api/fb/callback` (для разработки)
   - **Client OAuth Login**: включено
   - **Web OAuth Login**: включено
5. Скопируйте **App ID** и **App Secret**

### Настройка Backend

1. Перейдите в папку `backend/`
2. Создайте файл `.env`:
   ```env
   FACEBOOK_APP_ID=your_facebook_app_id_here
   FACEBOOK_APP_SECRET=your_facebook_app_secret_here
   FACEBOOK_REDIRECT_URI=http://localhost:8000/api/fb/callback
   SECRET_KEY=your-secret-key-change-this-in-production
   BACKEND_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:3000
   FLASK_ENV=development
   DEBUG=True
   ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Запустите сервер:
   ```bash
   python main.py
   ```

### Настройка Frontend

1. Перейдите в папку `frontend/`
2. Создайте файл `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
   REACT_APP_ENV=development
   ```
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Запустите приложение:
   ```bash
   npm start
   ```

## 📱 Функциональность

### Facebook интеграция

- ✅ **Подключение к Facebook** - пользователь может подключить свой Facebook аккаунт
- ✅ **Отображение профиля** - после подключения показывается аватар и имя пользователя
- ✅ **Переход в профиль** - клик по профилю открывает страницу Facebook
- ✅ **Отключение** - пользователь может отключить Facebook аккаунт

### Профиль пользователя

- ✅ Информация о пользователе Telegram
- ✅ Управление темой (светлая/темная)
- ✅ Переход к тарифам
- ✅ Управление подключением к Facebook

## 🔧 API Endpoints

### Facebook Auth
- `GET /api/fb/login` - Редирект на Facebook OAuth
- `GET/POST /api/fb/callback` - Обработка callback от Facebook
- `POST /api/fb/logout` - Отключение от Facebook
- `GET /api/fb/profile` - Получение профиля Facebook
- `GET /api/fb/accounts` - Получение рекламных аккаунтов

### User
- `GET /api/user/profile` - Профиль пользователя
- `GET /api/me` - Информация о текущем пользователе

### Tariffs
- `GET /api/tariffs` - Список тарифов

## 📁 Структура проекта

```
bot/
├── backend/                 # Flask API сервер
│   ├── main.py             # Основной файл сервера
│   ├── requirements.txt    # Python зависимости
│   └── README.md          # Документация бэкенда
├── frontend/               # React приложение
│   ├── src/
│   │   ├── pages/
│   │   │   └── Profile.js  # Страница профиля с Facebook интеграцией
│   │   └── api.js         # Конфигурация API
│   ├── public/
│   │   └── facebook-callback.html  # Страница обработки callback
│   └── README.md          # Документация фронтенда
└── README.md              # Основная документация
```

## 🔐 Безопасность

- Используются долгосрочные токены Facebook
- JWT токены для аутентификации
- Безопасное хранение токенов
- CORS настройки для безопасности

## 🚀 Развертывание

### Backend (Render/Heroku)
1. Создайте файл `render.yaml` или `Procfile`
2. Установите переменные окружения
3. Укажите правильный `FACEBOOK_REDIRECT_URI` для продакшена

### Frontend (Vercel/Netlify)
1. Создайте файл `.env.production`
2. Укажите правильный `REACT_APP_API_URL`
3. Разверните приложение

## 📝 Лицензия

MIT License 