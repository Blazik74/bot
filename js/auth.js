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

    async loadUserFromStorage() {
        const savedUser = localStorage.getItem('arness_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isAuthenticated = true;
                await this.checkServerSession();
                this.updateProfileDisplay();
            } catch (error) {
                console.error('Ошибка загрузки пользователя:', error);
                localStorage.removeItem('arness_user');
            }
        } else {
            this.updateProfileDisplay();
        }
    }

    async checkServerSession() {
        try {
            const response = await fetch('/api/auth/check', { credentials: 'include' });
            const data = await response.json();
            if (data.authenticated) {
                this.currentUser = data.user;
                this.isAuthenticated = true;
                this.saveUserToStorage(data.user);
                this.updateProfileDisplay();
            } else {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.removeUserFromStorage();
                this.updateProfileDisplay();
            }
        } catch (error) {
            console.error('Ошибка проверки сессии:', error);
            this.updateProfileDisplay();
        }
    }

    saveUserToStorage(user) {
        localStorage.setItem('arness_user', JSON.stringify(user));
    }

    removeUserFromStorage() {
        localStorage.removeItem('arness_user');
    }

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        const discordLoginBtn = document.getElementById('discordLoginBtn');
        if (discordLoginBtn) {
            discordLoginBtn.addEventListener('click', () => this.handleDiscordLogin());
        }

        const loginBtnDropdown = document.getElementById('loginBtnDropdown');
        if (loginBtnDropdown) {
            loginBtnDropdown.addEventListener('click', () => {
                showPage('login');
                document.getElementById('authDropdown').classList.remove('active');
            });
        }
        const registerBtnDropdown = document.getElementById('registerBtnDropdown');
        if (registerBtnDropdown) {
            registerBtnDropdown.addEventListener('click', () => {
                showPage('register');
                document.getElementById('authDropdown').classList.remove('active');
            });
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        this.clearErrors('login');
        if (!this.validateLoginForm(username, password)) {
            return;
        }
        let originalText = '';
        try {
            const submitBtn = e.target.querySelector('.form-submit');
            if (submitBtn) {
                originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<span class="loading"></span> Вход...';
                submitBtn.disabled = true;
            }
            const user = await this.loginUser(username, password);
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveUserToStorage(user);
            this.showNotification('Успешный вход!', 'success');
            this.checkAuth();
            this.updateProfileDisplay();
            showPage('main');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            const submitBtn = e.target.querySelector('.form-submit');
            if (submitBtn && originalText) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        this.clearErrors('register');
        if (!this.validateRegisterForm(username, email, password, confirmPassword)) {
            return;
        }
        let originalText = '';
        try {
            const submitBtn = e.target.querySelector('.form-submit');
            if (submitBtn) {
                originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<span class="loading"></span> Регистрация...';
                submitBtn.disabled = true;
            }
            const user = await this.registerUser(username, email, password);
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveUserToStorage(user);
            this.showNotification('Регистрация успешна! Добро пожаловать!', 'success');
            this.checkAuth();
            this.updateProfileDisplay();
            showPage('main');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            const submitBtn = e.target.querySelector('.form-submit');
            if (submitBtn && originalText) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    }

    validateLoginForm(username, password) {
        let isValid = true;

        if (!username) {
            this.showError('loginUsernameError', 'Введите ник');
            isValid = false;
        }

        if (!password) {
            this.showError('loginPasswordError', 'Введите пароль');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(username, email, password, confirmPassword) {
        let isValid = true;

        if (!username) {
            this.showError('registerUsernameError', 'Введите имя пользователя');
            isValid = false;
        }
        if (!email) {
            this.showError('registerEmailError', 'Введите email или логин');
            isValid = false;
        }
        if (!password) {
            this.showError('registerPasswordError', 'Введите пароль');
            isValid = false;
        }
        if (password !== confirmPassword) {
            this.showError('registerConfirmPasswordError', 'Пароли не совпадают');
            isValid = false;
        }
        return isValid;
    }

    async loginUser(username, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
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

    async registerUser(username, email, password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
                credentials: 'include'
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

    handleDiscordLogin() {
        const clientId = '1391384219661500558'; // Discord Client ID
        const redirectUri = encodeURIComponent('https://arness-community.onrender.com/auth/discord/callback');
        const scope = 'identify email';
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
        
        window.location.href = discordAuthUrl;
    }

    async handleDiscordCallback(code) {
        try {
            const user = await this.exchangeDiscordCode(code);
            this.currentUser = user;
            this.isAuthenticated = true;
            this.saveUserToStorage(user);
            await this.checkServerSession();
            this.showNotification('Успешный вход через Discord!', 'success');
            this.checkAuth();
            this.updateProfileDisplay();
            showPage('main');
        } catch (error) {
            this.showNotification('Ошибка входа через Discord', 'error');
        }
    }

    async exchangeDiscordCode(code) {
        try {
            const response = await fetch('/api/auth/discord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
                credentials: 'include'
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

    async logout() {
        try {
            const resp = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (resp.ok) {
                this.currentUser = null;
                if (window.app) {
                    window.app.showPage('login');
                    if (window.app.authManager) window.app.authManager.checkAuth();
                }
            } else {
                alert('Ошибка выхода из аккаунта. Попробуйте ещё раз.');
            }
        } catch (e) {
            alert('Ошибка выхода из аккаунта. Проверьте соединение.');
        }
    }

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
            
            this.updateProfileDisplay();
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (registerBtn) registerBtn.style.display = 'block';
            if (accountBtn) accountBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

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

        if (discordElement && discordUsernameElement) {
            if (this.currentUser.discordId) {
                discordElement.style.display = 'flex';
                discordUsernameElement.textContent = this.currentUser.username;
            } else {
                discordElement.style.display = 'none';
            }
        }

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

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    clearErrors(formType) {
        const errorElements = document.querySelectorAll(`#${formType}Page .error-message`);
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    checkTwitchCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const twitchSuccess = urlParams.get('twitch_success');
        if (twitchSuccess && this.authManager) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.authManager.checkServerSession();
            this.authManager.checkAuth();
            this.authManager.updateProfileDisplay();
            this.showPage('account');
            this.showNotification('Twitch аккаунт успешно привязан!', 'success');
        }
    }
}

window.AuthManager = AuthManager; 