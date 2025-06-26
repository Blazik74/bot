# 🚀 Руководство по деплою на Render.com

## 📋 Предварительные требования

1. **GitHub репозиторий** с кодом
2. **Аккаунт на Render.com**
3. **Facebook App** настроенный

## 🔧 Шаги деплоя

### 1. Подготовка репозитория

Убедитесь, что в корне репозитория есть следующие файлы:
- `api.py` - основной файл приложения
- `requirements.txt` - зависимости Python
- `Procfile` - команда запуска
- `render.yaml` - конфигурация Render
- `static/` - папка со статическими файлами

### 2. Создание сервиса на Render.com

1. Зайдите на [render.com](https://render.com)
2. Нажмите "New +" → "Web Service"
3. Подключите ваш GitHub репозиторий
4. Выберите репозиторий с кодом

### 3. Настройка сервиса

**Основные настройки:**
- **Name**: `tg-miniapp` (или любое другое)
- **Environment**: `Python`
- **Region**: `Oregon (US West)` (или ближайший к вам)
- **Branch**: `main` (или ваша основная ветка)
- **Root Directory**: оставьте пустым (если код в корне)

**Build & Deploy:**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python api.py`

### 4. Переменные окружения

Добавьте следующие переменные в разделе "Environment Variables":

```
SECRET_KEY = [автогенерируется Render]
FACEBOOK_APP_ID = [ваш Facebook App ID]
FACEBOOK_APP_SECRET = [ваш Facebook App Secret]
FACEBOOK_REDIRECT_URI = https://tg-miniapp-7li9.onrender.com/facebook-callback.html
```

### 5. Настройка Facebook App

1. Зайдите в [Facebook Developers](https://developers.facebook.com)
2. Выберите ваше приложение
3. В настройках добавьте:
   - **App Domains**: `tg-miniapp-7li9.onrender.com`
   - **Privacy Policy URL**: `https://tg-miniapp-7li9.onrender.com/privacy-policy.html`
   - **Terms of Service URL**: `https://tg-miniapp-7li9.onrender.com/terms-of-service.html`

4. В разделе "Facebook Login" → "Settings":
   - **Valid OAuth Redirect URIs**: `https://tg-miniapp-7li9.onrender.com/facebook-callback.html`

### 6. Деплой

1. Нажмите "Create Web Service"
2. Дождитесь завершения сборки (обычно 2-5 минут)
3. После успешного деплоя получите URL вида: `https://tg-miniapp-7li9.onrender.com`

## 🔍 Проверка работы

### Тест API
Откройте в браузере: `https://tg-miniapp-7li9.onrender.com/api/tariffs`

Должен вернуться JSON с тарифами.

### Тест главной страницы
Откройте: `https://tg-miniapp-7li9.onrender.com`

Должна загрузиться главная страница с кнопками тестирования.

## 🐛 Устранение проблем

### Ошибка "No module named 'distutils'"
**Решение**: Используйте Python 3.11 вместо 3.12

### Ошибка сборки
**Решение**: Проверьте `requirements.txt` - используйте только бинарные пакеты

### Ошибка Facebook OAuth
**Решение**: Проверьте правильность URL в Facebook App settings

### Ошибка "Module not found"
**Решение**: Убедитесь, что все зависимости в `requirements.txt`

## 📱 Интеграция с Telegram

После успешного деплоя:

1. Создайте бота через @BotFather
2. Настройте Web App URL: `https://tg-miniapp-7li9.onrender.com`
3. Протестируйте в Telegram

## 🔄 Обновления

Для обновления приложения:
1. Запушьте изменения в GitHub
2. Render автоматически пересоберет и перезапустит приложение

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Render Dashboard
2. Убедитесь в правильности переменных окружения
3. Проверьте Facebook App настройки 