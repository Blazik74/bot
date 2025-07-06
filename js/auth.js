// Модуль авторизации
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.checkAuth();
    }

    // Загрузка пользователя из localStorage и проверка сессии
    async loadUserFromStorage() {
        const savedUser = localStorage.getItem('arness_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
                
                // Проверяем сессию на сервере
                await this.checkServerSession();
            } catch (error) {
                console.error('Ошибка загрузки пользователя:', error);
                localStorage.removeItem('arness_user');
            }
        }
    }

    // Проверка сессии на сервере
    async checkServerSession() {
        try {
            const response = await fetch('/api/auth/check');
            const data = await response.json();
            
            if (data.authenticated) {
                this.currentUser = data.user;
                this.isAuthenticated = true;
                this.saveUserToStorage(data.user);
            } else {
                // Сессия истекла
                this.currentUser = null;
                this.isAuthenticated = false;
                this.removeUserFromStorage();
            }
        } catch (error) {
            console.error('Ошибка проверки сессии:', error);
        }
    }

    // Сохранение пользователя в localStorage
    saveUserToStorage(user) {
        localStorage.setItem('arness_user', JSON.stringify(user));
    }

    // Удаление пользователя из localStorage
    removeUserFromStorage() {
        localStorage.removeItem('arness_user');
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Форма входа
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Форма регистрации
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Кнопка выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Discord авторизация
        const discordLoginBtn = document.getElementById('discordLoginBtn');
        if (discordLoginBtn) {
            discordLoginBtn.addEventListener('click', () => this.handleDiscordLogin());
        }
    }

    // Обработка входа
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Сбросить ошибки
        this.clearErrors('login');
        
        // Валидация
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        try {
            const submitBtn = e.target.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Вход...';
            submitBtn.disabled = true;

            // Здесь будет запрос к API
            const user = await this.loginUser(email, password);
            
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveUserToStorage(user);
            
            this.showNotification('Успешный вход!', 'success');
            this.checkAuth();
            showPage('main');
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            const submitBtn = e.target.querySelector('.form-submit');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Обработка регистрации
    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        // Сбросить ошибки
        this.clearErrors('register');
        
        // Валидация
        if (!this.validateRegisterForm(username, email, password, confirmPassword)) {
            return;
        }

        try {
            const submitBtn = e.target.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Регистрация...';
            submitBtn.disabled = true;

            // Здесь будет запрос к API
            const user = await this.registerUser(username, email, password);
            
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveUserToStorage(user);
            
            this.showNotification('Регистрация успешна! Добро пожаловать!', 'success');
            this.checkAuth();
            showPage('main');
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            const submitBtn = e.target.querySelector('.form-submit');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Валидация формы входа
    validateLoginForm(email, password) {
        let isValid = true;

        if (!email) {
            this.showError('loginEmailError', 'Введите email');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('loginEmailError', 'Введите корректный email');
            isValid = false;
        }

        if (!password) {
            this.showError('loginPasswordError', 'Введите пароль');
            isValid = false;
        }

        return isValid;
    }

    // Валидация формы регистрации
    validateRegisterForm(username, email, password, confirmPassword) {
        let isValid = true;

        if (!username) {
            this.showError('registerUsernameError', 'Введите имя пользователя');
            isValid = false;
        } else if (username.length < 3) {
            this.showError('registerUsernameError', 'Имя пользователя должно быть не менее 3 символов');
            isValid = false;
        }

        if (!email) {
            this.showError('registerEmailError', 'Введите email');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showError('registerEmailError', 'Введите корректный email');
            isValid = false;
        }

        if (!password) {
            this.showError('registerPasswordError', 'Введите пароль');
            isValid = false;
        } else if (password.length < 6) {
            this.showError('registerPasswordError', 'Пароль должен быть не менее 6 символов');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showError('registerConfirmPasswordError', 'Пароли не совпадают');
            isValid = false;
        }

        return isValid;
    }

    // Проверка корректности email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Показать ошибку
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    // Очистить ошибки
    clearErrors(formType) {
        const errorElements = document.querySelectorAll(`#${formType}Page .error-message`);
        errorElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Вход пользователя через API
    async loginUser(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }

            return data.user;
        } catch (error) {
            throw new Error(error.message || 'Ошибка подключения к серверу');
        }
    }

    // Регистрация пользователя через API
    async registerUser(username, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка регистрации');
            }

            return data.user;
        } catch (error) {
            throw new Error(error.message || 'Ошибка подключения к серверу');
        }
    }

    // Discord авторизация
    handleDiscordLogin() {
        // Discord OAuth2 URL
        const clientId = '1391384219661500558'; // Discord Client ID
        const redirectUri = encodeURIComponent('https://arness-community.onrender.com');
        const scope = 'identify email';
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
        
        window.location.href = discordAuthUrl;
    }

    // Обработка Discord callback
    async handleDiscordCallback(code) {
        try {
            // Здесь будет обмен кода на токен и получение данных пользователя
            const user = await this.exchangeDiscordCode(code);
            
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveUserToStorage(user);
            
            this.showNotification('Успешный вход через Discord!', 'success');
            this.checkAuth();
            showPage('main');
            
        } catch (error) {
            this.showNotification('Ошибка входа через Discord', 'error');
        }
    }

    // Обмен кода Discord на токен через API
    async exchangeDiscordCode(code) {
        try {
            const response = await fetch('/api/auth/discord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            if (!response.ok) {
                throw new Error('Ошибка авторизации через Discord');
            }

            const user = await response.json();
            return user;
        } catch (error) {
            throw new Error('Не удалось авторизоваться через Discord');
        }
    }

    // Выход
    async logout() {
        try {
            // Отправляем запрос на сервер для выхода
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
        
        this.currentUser = null;
        this.isAuthenticated = false;
        this.removeUserFromStorage();
        
        this.showNotification('Вы вышли из аккаунта', 'info');
        this.checkAuth();
        showPage('main');
    }

    // Проверка авторизации
    checkAuth() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const accountBtn = document.getElementById('accountBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (this.isAuthenticated && this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (accountBtn) accountBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            // Обновляем данные профиля
            this.updateProfileDisplay();
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (accountBtn) accountBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    // Обновление отображения профиля
    updateProfileDisplay() {
        if (!this.currentUser) return;

        const usernameElement = document.getElementById('accountUsername');
        const emailElement = document.getElementById('accountEmail');
        const dateElement = document.getElementById('accountDate');
        const avatarElement = document.getElementById('accountAvatar');
        const discordElement = document.getElementById('accountDiscord');
        const discordUsernameElement = document.getElementById('accountDiscordUsername');
        const twitchElement = document.getElementById('accountTwitch');
        const twitchUsernameElement = document.getElementById('accountTwitchUsername');
        const twitchBtn = document.getElementById('twitchLoginBtn');

        if (usernameElement) usernameElement.textContent = this.currentUser.username;
        if (emailElement) emailElement.textContent = this.currentUser.email;
        if (dateElement) dateElement.textContent = this.currentUser.registrationDate;
        if (avatarElement) avatarElement.src = this.currentUser.avatar;

        // Discord
        if (discordElement && discordUsernameElement) {
            if (this.currentUser.discordId) {
                discordElement.style.display = 'flex';
                discordUsernameElement.textContent = this.currentUser.username;
            } else {
                discordElement.style.display = 'none';
            }
        }

        // Twitch
        if (twitchElement && twitchUsernameElement && twitchBtn) {
            if (this.currentUser.twitchUsername) {
                twitchElement.style.display = 'flex';
                twitchUsernameElement.textContent = this.currentUser.twitchUsername;
                twitchBtn.style.display = 'none';
            } else {
                twitchElement.style.display = 'flex';
                twitchUsernameElement.textContent = 'Не подключен';
                twitchBtn.style.display = 'inline-block';
            }
        }
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Показать уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Скрыть уведомление
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Получить текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Проверить, авторизован ли пользователь
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Экспорт для использования в других модулях
window.AuthManager = AuthManager; 