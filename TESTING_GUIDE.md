# Руководство по тестированию Facebook интеграции

## 🧪 Тестирование локально

### 1. Подготовка

1. **Создайте Facebook App** (если еще не создали):
   - Перейдите на [Facebook Developers](https://developers.facebook.com/)
   - Создайте новое приложение
   - Добавьте продукт "Facebook Login"
   - В настройках укажите: `http://localhost:8000/api/fb/callback`

2. **Настройте переменные окружения**:

   **Backend** (`backend/.env`):
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

   **Frontend** (`frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:8000
   REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
   REACT_APP_ENV=development
   ```

### 2. Запуск

1. **Запустите Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
   Сервер будет доступен на `http://localhost:8000`

2. **Запустите Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Приложение будет доступно на `http://localhost:3000`

### 3. Тестирование

1. **Откройте приложение** в браузере: `http://localhost:3000`
2. **Перейдите на страницу профиля** (`/profile`)
3. **Нажмите "Подключить Facebook"**
4. **Авторизуйтесь в Facebook**
5. **Проверьте результат**:
   - Должен отобразиться профиль Facebook (аватар + имя)
   - При клике на профиль должна открыться страница Facebook
   - Кнопка "Отключить Facebook" должна работать

## 🔍 Проверка API

### Тестирование эндпоинтов

1. **Проверка подключения к Facebook**:
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/me
   ```

2. **Получение профиля Facebook**:
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/fb/profile
   ```

3. **Получение рекламных аккаунтов**:
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/fb/accounts
   ```

## 🐛 Отладка

### Частые проблемы

1. **"Facebook App credentials are not configured"**:
   - Проверьте переменные окружения в `backend/.env`
   - Убедитесь, что `FACEBOOK_APP_ID` и `FACEBOOK_APP_SECRET` установлены

2. **"Invalid OAuth redirect URI"**:
   - Проверьте настройки Facebook App
   - URI должен точно совпадать: `http://localhost:8000/api/fb/callback`

3. **"Failed to retrieve access token"**:
   - Проверьте `FACEBOOK_APP_SECRET`
   - Убедитесь, что приложение не в режиме разработки

4. **CORS ошибки**:
   - Проверьте настройки CORS в `backend/main.py`
   - Убедитесь, что фронтенд и бэкенд работают на правильных портах

### Логи

- **Backend логи**: выводятся в консоли при запуске `python main.py`
- **Frontend логи**: открыть DevTools (F12) → Console
- **Network запросы**: DevTools → Network

## 📱 Тестирование в Telegram

1. **Настройте Telegram Bot** (если нужно):
   - Создайте бота через @BotFather
   - Получите токен бота
   - Добавьте в переменные окружения

2. **Тестирование в Telegram Mini App**:
   - Разверните приложение на хостинге
   - Обновите `FACEBOOK_REDIRECT_URI` на продакшен URL
   - Протестируйте через Telegram

## ✅ Чек-лист тестирования

- [ ] Facebook App создан и настроен
- [ ] Переменные окружения установлены
- [ ] Backend запускается без ошибок
- [ ] Frontend запускается без ошибок
- [ ] Кнопка "Подключить Facebook" работает
- [ ] Авторизация в Facebook проходит успешно
- [ ] Профиль Facebook отображается после подключения
- [ ] Клик по профилю открывает Facebook
- [ ] Кнопка "Отключить Facebook" работает
- [ ] API эндпоинты возвращают корректные данные
- [ ] Нет ошибок в консоли браузера
- [ ] Нет ошибок в логах сервера 