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
            const animationsEnabled = this.settingsManager ? this.settingsManager.getSettings().animations.enabled : true;
            sections.forEach(section => {
                if (!animationsEnabled) {
                    section.classList.add('visible');
                    section.style.transition = 'none';
                } else {
                    const sectionTop = section.getBoundingClientRect().top;
                    if (sectionTop < windowHeight - revealPoint) {
                        section.classList.add('visible');
                        section.style.transition = '';
                    }
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
        const settings = this.settingsManager ? this.settingsManager.getSettings() : { animations: { enabled: true, particleCount: 30 } };
        if (!settings.animations.enabled) return;
        const particleCount = settings.animations.particleCount;

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
            // Меняем URL
            let url = '/';
            if (pageName === 'account') url = '/profile';
            if (pageName === 'settings') url = '/profile/settings';
            if (pageName === 'donate') url = '/profile/donate';
            if (window.location.pathname !== url) {
                window.history.pushState({page: pageName}, '', url);
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
        // SPA-роутинг: открытие нужной страницы по URL
        this.setupSpaRouting();
        const path = window.location.pathname;
        if (path === '/profile') this.showPage('account');
        else if (path === '/profile/settings') this.showPage('settings');
        else if (path === '/profile/donate') this.showPage('donate');
        else this.showPage('main');
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

    // SPA-роутинг: обработка перехода по истории браузера
    setupSpaRouting() {
        window.addEventListener('popstate', (e) => {
            const path = window.location.pathname;
            if (path === '/profile') this.showPage('account');
            else if (path === '/profile/settings') this.showPage('settings');
            else if (path === '/profile/donate') this.showPage('donate');
            else this.showPage('main');
        });
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

    // --- Аватарка: модальное окно ---
    const avatar = document.getElementById('accountAvatar');
    const modal = document.getElementById('avatarModal');
    const modalImg = document.getElementById('avatarModalImg');
    const modalClose = document.getElementById('avatarModalClose');
    const modalBackdrop = document.getElementById('avatarModalBackdrop');
    const modalDownload = document.getElementById('avatarModalDownload');
    const modalCopy = document.getElementById('avatarModalCopy');
    const modalCopied = document.getElementById('avatarModalCopied');

    function openAvatarModal() {
        if (!avatar || !modalImg) return;
        modalImg.src = avatar.src;
        modal.style.display = 'flex';
    }
    function closeAvatarModal() {
        modal.style.display = 'none';
        modalImg.src = '';
        modalCopied.style.display = 'none';
    }
    if (avatar) {
        avatar.style.cursor = 'pointer';
        avatar.addEventListener('click', openAvatarModal);
    }
    if (modalClose) modalClose.addEventListener('click', closeAvatarModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeAvatarModal);
    // Закрытие по Esc
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex' && e.key === 'Escape') closeAvatarModal();
    });
    // Скачать аватарку
    if (modalDownload) {
        modalDownload.addEventListener('click', () => {
            const url = modalImg.src;
            const a = document.createElement('a');
            a.href = url;
            a.download = 'avatar.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
    // Копировать ссылку
    if (modalCopy) {
        modalCopy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(modalImg.src);
                modalCopied.style.display = 'block';
                setTimeout(() => { modalCopied.style.display = 'none'; }, 1500);
            } catch (e) {
                modalCopied.textContent = 'Ошибка копирования!';
                modalCopied.style.display = 'block';
                setTimeout(() => { modalCopied.style.display = 'none'; modalCopied.textContent = 'Ссылка скопирована!'; }, 2000);
            }
        });
    }

    // --- Twitch профиль ---
    const twitchUsernameEl = document.getElementById('accountTwitchUsername');
    const twitchProfilePage = document.getElementById('twitchProfilePage');
    const accountPage = document.getElementById('accountPage');
    const backToAccountBtn = document.getElementById('backToAccountBtn');
    const twitchProfileInfo = document.getElementById('twitchProfileInfo');
    const twitchSubscriptionsList = document.getElementById('twitchSubscriptionsList');
    const twitchLiveStreams = document.getElementById('twitchLiveStreams');
    const twitchPlayerContainer = document.getElementById('twitchPlayerContainer');

    function showTwitchProfilePage() {
        if (accountPage) accountPage.style.display = 'none';
        if (twitchProfilePage) twitchProfilePage.style.display = 'block';
        loadTwitchProfile();
    }
    function showAccountPage() {
        if (twitchProfilePage) twitchProfilePage.style.display = 'none';
        if (accountPage) accountPage.style.display = 'block';
    }
    if (twitchUsernameEl) {
        twitchUsernameEl.style.cursor = 'pointer';
        twitchUsernameEl.style.textDecoration = 'underline';
        twitchUsernameEl.addEventListener('click', () => {
            if (twitchUsernameEl.textContent && twitchUsernameEl.textContent !== 'Не подключен') {
                showTwitchProfilePage();
            }
        });
    }
    if (backToAccountBtn) {
        backToAccountBtn.addEventListener('click', showAccountPage);
    }
    async function loadTwitchProfile() {
        const user = window.app?.authManager?.getCurrentUser?.();
        if (!user || !user.twitchUsername) {
            twitchProfileInfo.innerHTML = '<div class="twitch-profile-empty">Twitch не подключён.</div>';
            twitchSubscriptionsList.innerHTML = '';
            twitchLiveStreams.innerHTML = '';
            twitchPlayerContainer.innerHTML = '';
            return;
        }
        // Центрируем аватар и ник, БЕЗ кнопки назад
        twitchProfileInfo.innerHTML = `
            <div class="twitch-profile-center">
                <img class="twitch-avatar" src="https://static-cdn.jtvnw.net/jtv_user_pictures/${user.twitchId}-profile_image-110x110.png" onerror="this.style.display='none'" alt="Twitch Avatar">
                <div class="twitch-nick">${user.twitchUsername}</div>
            </div>
        `;
        // НЕ добавляем кнопку назад
        twitchSubscriptionsList.innerHTML = '<div class="twitch-loading">Загрузка подписок...</div>';
        twitchLiveStreams.innerHTML = '<div class="twitch-loading">Загрузка стримов...</div>';
        twitchPlayerContainer.innerHTML = '';
        try {
            const resp = await fetch('/api/twitch/subscriptions', { credentials: 'include' });
            if (!resp.ok) throw new Error('Ошибка Twitch API');
            const data = await resp.json();
            if (data.subscriptions && data.subscriptions.length > 0) {
                twitchSubscriptionsList.innerHTML = data.subscriptions.map(sub =>
                    `<div class="twitch-sub-item" data-twitch-id="${sub.to_id}" data-twitch-name="${sub.to_name}">
                        <img class="twitch-sub-avatar" src="https://static-cdn.jtvnw.net/jtv_user_pictures/${sub.to_id}-profile_image-50x50.png" onerror="this.style.display='none'">
                        <span class="twitch-sub-name">${sub.to_name}</span>
                    </div>`
                ).join('');
            } else {
                twitchSubscriptionsList.innerHTML = '<div class="twitch-empty">Нет подписок.</div>';
            }
            if (data.live && data.live.length > 0) {
                twitchLiveStreams.innerHTML = data.live.map(stream =>
                    `<div class="twitch-live-item" data-twitch-name="${stream.user_name}">
                        <b class="twitch-live-dot">●</b> <span class="twitch-live-nick">${stream.user_name}</span>
                        <span class="twitch-live-title">${stream.title}</span>
                        <button class="btn btn-secondary btn-watch-stream" data-twitch-name="${stream.user_name}">Смотреть</button>
                    </div>`
                ).join('');
            } else {
                twitchLiveStreams.innerHTML = '<div class="twitch-empty">Нет стримов онлайн.</div>';
            }
        } catch (e) {
            twitchSubscriptionsList.innerHTML = '<div class="twitch-error">Ошибка загрузки подписок.</div>';
            twitchLiveStreams.innerHTML = '<div class="twitch-error">Ошибка загрузки стримов.</div>';
        }
    }
    // Twitch-плеер: обработчик кнопок "Смотреть"
    if (twitchLiveStreams) {
        twitchLiveStreams.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-watch-stream');
            if (btn) {
                const channel = btn.getAttribute('data-twitch-name');
                if (channel) {
                    twitchPlayerContainer.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}" height="420" width="720" allowfullscreen frameborder="0"></iframe>`;
                    window.scrollTo({ top: twitchPlayerContainer.offsetTop - 40, behavior: 'smooth' });
                }
            }
        });
    }
});

// --- DONATE PAGE: ЮMoney integration ---
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.pay-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const amount = parseInt(btn.getAttribute('data-amount'));
            const coins = parseInt(btn.getAttribute('data-coins'));
            
            // Создаем уникальный ID заказа
            const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Сначала создаем платеж на сервере
            fetch('/api/donate/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    amount: amount,
                    coins: coins,
                    userId: currentUser ? currentUser.id : null,
                    description: `Покупка ${coins} монет`
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.paymentUrl) {
                    // Открываем ЮMoney виджет
                    const checkout = new window.YooKassa.Checkout({
                        confirmation_token: data.confirmationToken,
                        return_url: window.location.origin + '/profile/donate',
                        error_callback: function(error) {
                            console.error('Ошибка оплаты:', error);
                            showCustomNotification('Ошибка при создании платежа. Попробуйте еще раз.', 'error');
                        }
                    });
                    
                    checkout.render('payment-form');
                    
                    // Обработка успешной оплаты
                    checkout.on('success', function(event) {
                        console.log('Оплата успешна:', event);
                        // Отправляем запрос на сервер для начисления монет
                        fetch('/api/donate/success', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                orderId: orderId,
                                amount: amount,
                                coins: coins,
                                userId: currentUser ? currentUser.id : null,
                                paymentId: event.payment_id
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                showCustomNotification('Оплата прошла успешно!\nНачислено ' + coins + ' монет.', 'success');
                                // Обновляем баланс пользователя
                                if (currentUser) {
                                    currentUser.coins = (currentUser.coins || 0) + coins;
                                    updateUserInterface();
                                }
                            } else {
                                showCustomNotification('Ошибка начисления монет: ' + data.error, 'error');
                            }
                        })
                        .catch(error => {
                            console.error('Ошибка запроса:', error);
                            showCustomNotification('Ошибка обработки платежа. Обратитесь в поддержку.', 'error');
                        });
                    });
                    
                } else {
                    showCustomNotification('Ошибка создания платежа: ' + (data.error || 'Неизвестная ошибка'), 'error');
                }
            })
            .catch(error => {
                console.error('Ошибка запроса:', error);
                showCustomNotification('Ошибка соединения с сервером. Попробуйте еще раз.', 'error');
            });
        });
    });
});

// === DONATE SLIDER & PACKAGES ===
document.addEventListener('DOMContentLoaded', function() {
  const donateRange = document.getElementById('donateRange');
  const donateRangeValue = document.getElementById('donateRangeValue');
  const donateRangePrice = document.getElementById('donateRangePrice');
  const quickBtns = document.querySelectorAll('.donate-quick-btn');
  const payBtn = document.getElementById('donatePayBtn');

  // Курс: 100 монет = 50₽, 500 = 200₽, 1000 = 350₽, 2500 = 800₽, иначе 1 монета = 0.5₽
  function calcPrice(coins) {
    if (coins == 100) return 50;
    if (coins == 500) return 200;
    if (coins == 1000) return 350;
    if (coins == 2500) return 800;
    return Math.round(coins * 0.5);
  }

  function updateSlider() {
    const coins = parseInt(donateRange.value, 10);
    donateRangeValue.textContent = coins;
    donateRangePrice.textContent = calcPrice(coins);
    payBtn.dataset.amount = calcPrice(coins);
    payBtn.dataset.coins = coins;
  }

  if (donateRange) {
    donateRange.addEventListener('input', updateSlider);
    updateSlider();
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const coins = this.dataset.coins;
      donateRange.value = coins;
      updateSlider();
    });
  });

  if (payBtn) {
    payBtn.addEventListener('click', function() {
      const amount = this.dataset.amount || calcPrice(donateRange.value);
      const coins = this.dataset.coins || donateRange.value;
      // Здесь должна быть логика оплаты через ЮMoney с amount и coins
      // Например: startYooKassaPayment(amount, coins);
      if (typeof startYooKassaPayment === 'function') {
        startYooKassaPayment(amount, coins);
      } else {
        showCustomNotification('Оплата: ' + amount + '₽ за ' + coins + ' монет', 'info');
      }
    });
  }
});

// === FOOTER CONTACTS TOGGLE ===
// Удалено: дублирующий обработчик для footerContactsBtn (оставлен только один ниже)

// === CUSTOM NOTIFICATIONS ===
(function() {
  if (document.getElementById('customNotification')) return;
  const notif = document.createElement('div');
  notif.id = 'customNotification';
  notif.style.position = 'fixed';
  notif.style.right = '32px';
  notif.style.bottom = '32px';
  notif.style.zIndex = '9999';
  notif.style.minWidth = '240px';
  notif.style.maxWidth = '90vw';
  notif.style.display = 'none';
  notif.style.padding = '18px 28px 18px 22px';
  notif.style.borderRadius = '14px';
  notif.style.fontSize = '1.08em';
  notif.style.fontWeight = '600';
  notif.style.boxShadow = '0 4px 24px rgba(124,58,237,0.18)';
  notif.style.transition = 'opacity 0.3s, transform 0.3s';
  notif.style.opacity = '0';
  notif.innerHTML = '<span id="notifIcon" style="margin-right:12px;font-size:1.3em;"></span><span id="notifText"></span>';
  document.body.appendChild(notif);

  window.showCustomNotification = function(message, type = 'info') {
    const colors = {
      success: '#2ed573',
      error: '#ff4757',
      info: '#a78bfa',
      warn: '#ffd700'
    };
    const icons = {
      success: '✔️',
      error: '❌',
      info: 'ℹ️',
      warn: '⚠️'
    };
    notif.style.background = '#23232b';
    notif.style.color = colors[type] || '#a78bfa';
    notif.style.border = `2px solid ${colors[type] || '#a78bfa'}`;
    notif.querySelector('#notifIcon').textContent = icons[type] || 'ℹ️';
    notif.querySelector('#notifText').textContent = message;
    notif.style.display = 'block';
    setTimeout(() => {
      notif.style.opacity = '1';
      notif.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateY(30px)';
      setTimeout(() => { notif.style.display = 'none'; }, 350);
    }, 3200);
  };
})();

// === SPA Policy/Agreement Modal (исправлено, без hash, с pushState) ===
function openPolicyModal(type, push = true) {
  const modal = document.getElementById(type === 'privacy' ? 'privacyModal' : 'agreementModal');
  if (!modal) return;
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.remove('hide'), 10);
  document.body.style.overflow = 'hidden';
  if (push) history.pushState({modal: type}, '', type === 'privacy' ? '?privacy' : '?agreement');
}
function closePolicyModal(type, push = true) {
  const modal = document.getElementById(type === 'privacy' ? 'privacyModal' : 'agreementModal');
  if (!modal) return;
  modal.classList.add('hide');
  setTimeout(() => { modal.style.display = 'none'; modal.classList.remove('hide'); document.body.style.overflow = ''; }, 400);
  if (push) history.replaceState({}, '', '/');
}
window.addEventListener('popstate', function(e) {
  if (e.state && e.state.modal) openPolicyModal(e.state.modal, false);
  else {
    closePolicyModal('privacy', false);
    closePolicyModal('agreement', false);
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Открытие по ссылкам
  document.getElementById('closePrivacy').onclick = () => { closePolicyModal('privacy'); };
  document.getElementById('closeAgreement').onclick = () => { closePolicyModal('agreement'); };
  document.querySelectorAll('.footer-nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '/privacy.html' || this.getAttribute('href') === '/agreement') {
        e.preventDefault();
        openPolicyModal(this.getAttribute('href') === '/privacy.html' ? 'privacy' : 'agreement');
      }
    });
  });
  // Контакты: только плавное раскрытие
  const contactsBtn = document.getElementById('footerContactsBtn');
  const contactsBlock = document.getElementById('footerContactsBlock');
  if (contactsBtn && contactsBlock) {
    contactsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      contactsBlock.classList.toggle('open');
    });
  }
});

document.querySelectorAll('.policy-modal').forEach(modal => {
  modal.addEventListener('mousedown', function(e) {
    if (e.target === modal) {
      if (modal.id === 'privacyModal') closePolicyModal('privacy');
      if (modal.id === 'agreementModal') closePolicyModal('agreement');
    }
  });
}); 
