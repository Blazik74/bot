// Основной модуль приложения
class App {
    constructor() {
        this.currentPage = 'main';
        this.authManager = null;
        this.settingsManager = null;
        this.init();
    }

    async init() {
        this.setupPages();
        this.setupNavigation();
        this.setupAnimations();
        await this.initializeManagers();
        this.setupEventListeners();
        await this.start();
    }

    // Настройка страниц
    setupPages() {
        this.pages = {
            main: document.getElementById('mainPage'),
            login: document.getElementById('loginPage'),
            register: document.getElementById('registerPage'),
            account: document.getElementById('accountPage')
        };
    }

    // Настройка навигации
    setupNavigation() {
        // Навигационные ссылки
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Логотип - переход на главную
        const navLogo = document.getElementById('navLogo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                this.showPage('main');
            });
        }

        // Иконка пользователя
        const userIcon = document.getElementById('userIcon');
        if (userIcon) {
            userIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.authManager && this.authManager.isUserAuthenticated()) {
                    this.showPage('account');
                } else {
                    this.toggleAuthDropdown();
                }
            });
        }

        // Выпадающее меню авторизации
        document.addEventListener('click', () => {
            this.hideAuthDropdown();
        });
    }

    // Настройка анимаций
    setupAnimations() {
        // Анимация появления секций при скролле
        this.setupScrollAnimations();
        
        // Анимация частиц фона
        this.createParticles();
    }

    // Настройка анимаций скролла
    setupScrollAnimations() {
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        const animateOnScroll = () => {
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;

                if (sectionTop < windowHeight - revealPoint) {
                    section.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);
    }

    // Создание частиц фона
    createParticles() {
        const bgAnimation = document.getElementById('bg-animation');
        if (!bgAnimation) return;

        // Очищаем существующие частицы
        bgAnimation.innerHTML = '';

        // Получаем настройки анимаций
        const particleCount = this.settingsManager ? 
            this.settingsManager.getSettings().animations.particleCount : 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 15 + 5;
            const posX = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 15 + 15;
            const opacity = Math.random() * 0.5 + 0.2;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.opacity = opacity;

            const hue = Math.floor(Math.random() * 20) + 250;
            particle.style.background = `hsl(${hue}, 80%, 65%)`;

            bgAnimation.appendChild(particle);
        }
    }

    // Инициализация менеджеров
    async initializeManagers() {
        // Инициализация менеджера авторизации
        this.authManager = new AuthManager();
        
        // Инициализация менеджера настроек
        this.settingsManager = new SettingsManager();
        
        // Добавляем страницу настроек в аккаунт
        this.setupAccountPage();
    }

    // Настройка страницы аккаунта
    setupAccountPage() {
        const accountContainer = document.querySelector('.account-container');
        if (!accountContainer) return;

        // Добавляем секцию настроек
        const settingsSection = document.createElement('div');
        settingsSection.className = 'settings-section';
        accountContainer.appendChild(settingsSection);

        // Рендерим настройки
        if (this.settingsManager) {
            this.settingsManager.renderSettingsPage();
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Обработчики кнопок авторизации
        this.setupAuthButtons();
        
        // Обработчики форм
        this.setupFormHandlers();
        
        // Обработчики Discord авторизации на страницах
        this.setupDiscordAuthButtons();
        
        // Обработчики переключения страниц
        this.setupPageSwitchers();
    }

    // Настройка кнопок авторизации
    setupAuthButtons() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const accountBtn = document.getElementById('accountBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showPage('login');
                this.hideAuthDropdown();
            });
        }

        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                this.showPage('register');
                this.hideAuthDropdown();
            });
        }

        if (accountBtn) {
            accountBtn.addEventListener('click', () => {
                this.showPage('account');
                this.hideAuthDropdown();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (this.authManager) {
                    this.authManager.logout();
                }
                this.hideAuthDropdown();
            });
        }
    }

    // Настройка обработчиков форм
    setupFormHandlers() {
        // Переключение между формами входа и регистрации
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('register');
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage('login');
            });
        }
    }

    // Настройка Discord авторизации на страницах
    setupDiscordAuthButtons() {
        const discordLoginBtn = document.getElementById('discordLoginBtnPage');
        const discordRegisterBtn = document.getElementById('discordRegisterBtnPage');

        if (discordLoginBtn) {
            discordLoginBtn.addEventListener('click', () => {
                if (this.authManager) {
                    this.authManager.handleDiscordLogin();
                }
            });
        }

        if (discordRegisterBtn) {
            discordRegisterBtn.addEventListener('click', () => {
                if (this.authManager) {
                    this.authManager.handleDiscordLogin();
                }
            });
        }
    }

    // Настройка переключателей страниц
    setupPageSwitchers() {
        // Переход на страницу доната по клику на баланс
        const balance = document.getElementById('accountBalance');
        if (balance) {
            balance.addEventListener('click', () => {
                this.showDonatePage();
            });
        }
        // Кнопка назад на странице доната
        const backBtn = document.getElementById('backToProfileBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('account');
            });
        }
        // Кнопка Twitch OAuth
        const twitchBtn = document.getElementById('twitchLoginBtn');
        if (twitchBtn) {
            twitchBtn.addEventListener('click', () => {
                window.location.href = '/auth/twitch';
            });
        }
    }

    // Показать страницу
    showPage(pageName) {
        // Список всех возможных страниц
        const allPages = [
            'mainPage', 'loginPage', 'registerPage', 'accountPage', 'donatePage'
        ];
        allPages.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        // Показываем нужную страницу
        let pageEl = null;
        if (this.pages && this.pages[pageName]) {
            pageEl = this.pages[pageName];
        } else {
            pageEl = document.getElementById(pageName + 'Page');
        }
        if (pageEl) {
            pageEl.style.display = 'block';
            this.currentPage = pageName;
            pageEl.classList.add('page-transition');
            setTimeout(() => {
                pageEl.classList.remove('page-transition');
            }, 500);
            if (pageName === 'account' && this.settingsManager) {
                setTimeout(() => {
                    this.settingsManager.renderSettingsPage();
                }, 100);
            }
        }
    }

    // Переключение выпадающего меню авторизации
    toggleAuthDropdown() {
        const authDropdown = document.getElementById('authDropdown');
        if (authDropdown) {
            authDropdown.classList.toggle('active');
        }
    }

    // Скрытие выпадающего меню авторизации
    hideAuthDropdown() {
        const authDropdown = document.getElementById('authDropdown');
        if (authDropdown) {
            authDropdown.classList.remove('active');
        }
    }

    // Запуск приложения
    async start() {
        // Сброс всех страниц
        ['mainPage','loginPage','registerPage','accountPage','donatePage'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        // Показываем главную страницу
        this.showPage('main');
        // Проверяем Twitch callback
        this.checkTwitchCallback();
        // Проверяем авторизацию
        if (!this.authManager) this.authManager = new AuthManager();
        await this.authManager.loadUserFromStorage();
        this.authManager.checkAuth();
        // Применяем настройки
        if (!this.settingsManager) this.settingsManager = new SettingsManager();
        await this.settingsManager.loadSettings();
        this.settingsManager.applySettings();
        // Проверяем Discord callback
        this.checkDiscordCallback();
    }

    checkTwitchCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const twitchSuccess = urlParams.get('twitch_success');
        if (twitchSuccess && this.authManager) {
            window.history.replaceState({}, document.title, window.location.pathname);
            // Обновляем профиль (перезагружаем данные)
            this.authManager.checkServerSession();
            this.authManager.checkAuth();
            this.showPage('account');
            this.showNotification('Twitch аккаунт успешно привязан!', 'success');
        }
        const twitchError = urlParams.get('error');
        if (twitchError && twitchError.includes('twitch')) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.showNotification('Ошибка авторизации через Twitch', 'error');
        }
    }

    // Проверка Discord callback
    checkDiscordCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const discordSuccess = urlParams.get('discord_success');
        const userData = urlParams.get('user');

        if (code && this.authManager) {
            // Очищаем URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Обрабатываем код Discord
            this.authManager.handleDiscordCallback(code);
        } else if (discordSuccess && this.authManager) {
            // После успешного входа через Discord
            window.history.replaceState({}, document.title, window.location.pathname);
            // Обновляем профиль (перезагружаем данные)
            this.authManager.checkServerSession();
            this.authManager.checkAuth();
            this.showPage('account');
            this.showNotification('Успешный вход через Discord!', 'success');
        } else if (error) {
            // Обрабатываем ошибку Discord
            window.history.replaceState({}, document.title, window.location.pathname);
            this.showNotification('Ошибка авторизации через Discord', 'error');
        }
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        if (this.authManager) {
            this.authManager.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Получить текущую страницу
    getCurrentPage() {
        return this.currentPage;
    }

    // Получить менеджер авторизации
    getAuthManager() {
        return this.authManager;
    }

    // Получить менеджер настроек
    getSettingsManager() {
        return this.settingsManager;
    }

    // Показать страницу доната
    showDonatePage() {
        // Скрыть все страницы
        Object.values(this.pages).forEach(page => {
            if (page) page.style.display = 'none';
        });
        // Показать страницу доната
        const donatePage = document.getElementById('donatePage');
        if (donatePage) donatePage.style.display = 'block';
        this.currentPage = 'donate';
    }
}

// Глобальная функция для показа страниц (для совместимости)
function showPage(pageName) {
    if (window.app) {
        window.app.showPage(pageName);
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Экспорт для использования в других модулях
window.App = App; 