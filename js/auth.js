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

    // Загрузка пользователя из localStorage
    loadUserFromStorage() {
        const savedUser = localStorage.getItem('arness_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
            } catch (error) {
                console.error('Ошибка загрузки пользователя:', error);
                localStorage.removeItem('arness_user');
            }
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

    // Вход пользователя (заглушка для API)
    async loginUser(email, password) {
        // Имитация запроса к API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Здесь будет реальный запрос к API
                if (email && password) {
                    resolve({
                        id: Date.now(),
                        username: email.split('@')[0],
                        email: email,
                        registrationDate: new Date().toLocaleDateString(),
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                        discordId: null
                    });
                } else {
                    reject(new Error('Неверный email или пароль'));
                }
            }, 1000);
        });
    }

    // Регистрация пользователя (заглушка для API)
    async registerUser(username, email, password) {
        // Имитация запроса к API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Здесь будет реальный запрос к API
                resolve({
                    id: Date.now(),
                    username: username,
                    email: email,
                    registrationDate: new Date().toLocaleDateString(),
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    discordId: null
                });
            }, 1000);
        });
    }

    // Discord авторизация
    handleDiscordLogin() {
        // Discord OAuth2 URL
        const clientId = '1391384219661500558'; // Discord Client ID
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/discord/callback');
        const scope = 'identify email';
        
        const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        
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

    // Обмен кода Discord на токен (заглушка)
    async exchangeDiscordCode(code) {
        // Здесь будет реальный запрос к вашему API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: Date.now(),
                    username: 'DiscordUser',
                    email: 'discord@example.com',
                    registrationDate: new Date().toLocaleDateString(),
                    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
                    discordId: '123456789'
                });
            }, 1000);
        });
    }

    // Выход
    logout() {
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

        if (usernameElement) usernameElement.textContent = this.currentUser.username;
        if (emailElement) emailElement.textContent = this.currentUser.email;
        if (dateElement) dateElement.textContent = this.currentUser.registrationDate;
        if (avatarElement) avatarElement.src = this.currentUser.avatar;
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