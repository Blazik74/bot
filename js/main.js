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

    setupPages() {
        this.pages = {
            main: document.getElementById('mainPage'),
            login: document.getElementById('loginPage'),
            register: document.getElementById('registerPage'),
            account: document.getElementById('accountPage'),
            donate: document.getElementById('donatePage'),
            twitchProfile: document.getElementById('twitchProfilePage')
        };
    }

    setupNavigation() {
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

        const navLogo = document.getElementById('navLogo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                this.showPage('main');
            });
        }

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

        document.addEventListener('click', () => {
            this.hideAuthDropdown();
        });
    }

    setupAnimations() {
        this.setupScrollAnimations();
        
        this.createParticles();
    }

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

    createParticles() {
        const bgAnimation = document.getElementById('bg-animation');
        if (!bgAnimation) return;

        bgAnimation.innerHTML = '';

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

    async initializeManagers() {
        this.authManager = new AuthManager();
        
        this.settingsManager = new SettingsManager();
        
        this.setupAccountPage();
    }

    setupAccountPage() {
        const accountContainer = document.querySelector('.account-container');
        if (!accountContainer) return;

        const settingsSection = document.createElement('div');
        settingsSection.className = 'settings-section';
        accountContainer.appendChild(settingsSection);

        if (this.settingsManager) {
            this.settingsManager.renderSettingsPage();
        }
    }

    setupEventListeners() {
        this.setupAuthButtons();
        
        this.setupFormHandlers();
        
        this.setupDiscordAuthButtons();
        
        this.setupPageSwitchers();
    }

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

    setupFormHandlers() {
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

    setupPageSwitchers() {
        const balance = document.getElementById('accountBalance');
        if (balance) {
            balance.addEventListener('click', () => {
                this.showDonatePage();
            });
        }
        const backBtn = document.getElementById('backToProfileBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('account');
            });
        }
        const twitchBtn = document.getElementById('twitchLoginBtn');
        if (twitchBtn) {
            twitchBtn.addEventListener('click', () => {
                window.location.href = '/auth/twitch';
            });
        }
    }

    showPage(pageName) {
        const allPages = [
            'mainPage', 'loginPage', 'registerPage', 'accountPage', 'donatePage', 'twitchProfilePage'
        ];
        allPages.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
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
            let url = '/';
            if (pageName === 'account') url = '/profile';
            if (pageName === 'settings') url = '/profile/settings';
            if (pageName === 'donate') url = '/profile/donate';
            if (pageName === 'twitchProfile') url = '/profile/twitch';
            if (window.location.pathname !== url) {
                window.history.pushState({page: pageName}, '', url);
            }
            if (pageName === 'twitchProfile') {
                this.loadTwitchProfile();
            }
        }
    }

    toggleAuthDropdown() {
        const authDropdown = document.getElementById('authDropdown');
        if (authDropdown) {
            authDropdown.classList.toggle('active');
        }
    }

    hideAuthDropdown() {
        const authDropdown = document.getElementById('authDropdown');
        if (authDropdown) {
            authDropdown.classList.remove('active');
        }
    }

    async start() {
        ['mainPage','loginPage','registerPage','accountPage','donatePage','twitchProfilePage'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        this.setupSpaRouting();
        const path = window.location.pathname;
        if (!this.authManager) this.authManager = new AuthManager();
        await this.authManager.loadUserFromStorage();
        this.authManager.checkAuth();
        if (!this.settingsManager) this.settingsManager = new SettingsManager();
        await this.settingsManager.loadSettings();
        this.settingsManager.applySettings();
        this.checkTwitchCallback();
        this.checkDiscordCallback();
        if (path === '/profile') this.showPage('account');
        else if (path === '/profile/settings') this.showPage('settings');
        else if (path === '/profile/donate' || path === '/donate') this.showPage('donate');
        else if (path === '/profile/twitch') this.showPage('twitchProfile');
        else this.showPage('main');
    }

    checkTwitchCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const twitchSuccess = urlParams.get('twitch_success');
        if (twitchSuccess && this.authManager) {
            window.history.replaceState({}, document.title, window.location.pathname);
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

    checkDiscordCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const discordSuccess = urlParams.get('discord_success');
        const userData = urlParams.get('user');

        if (code && this.authManager) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.authManager.handleDiscordCallback(code);
        } else if (discordSuccess && this.authManager) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.authManager.checkServerSession();
            this.authManager.checkAuth();
            this.showPage('account');
            this.showNotification('Успешный вход через Discord!', 'success');
        } else if (error) {
            window.history.replaceState({}, document.title, window.location.pathname);
            this.showNotification('Ошибка авторизации через Discord', 'error');
        }
    }

    showNotification(message, type = 'info') {
        if (this.authManager) {
            this.authManager.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getAuthManager() {
        return this.authManager;
    }

    getSettingsManager() {
        return this.settingsManager;
    }

    showDonatePage() {
        Object.values(this.pages).forEach(page => {
            if (page) page.style.display = 'none';
        });
        const donatePage = document.getElementById('donatePage');
        if (donatePage) donatePage.style.display = 'block';
        this.currentPage = 'donate';
    }

    setupSpaRouting() {
        window.addEventListener('popstate', (e) => {
            const path = window.location.pathname;
            if (path === '/profile') this.showPage('account');
            else if (path === '/profile/settings') this.showPage('settings');
            else if (path === '/profile/donate' || path === '/donate') this.showPage('donate');
            else if (path === '/profile/twitch') this.showPage('twitchProfile');
            else this.showPage('main');
        });
    }

    async loadTwitchProfile() {
        const user = this.authManager?.getCurrentUser?.();
        if (!user || !user.twitchUsername) {
            this.pages.twitchProfile.innerHTML = '<div class="twitch-profile-empty">Twitch не подключён.</div>';
            return;
        }
        this.pages.twitchProfile.innerHTML = `
            <div class="twitch-profile-user-block" style="display:flex;align-items:center;gap:22px;margin-bottom:24px;">
                <img class="twitch-avatar" id="twitchProfileAvatar" src="https://static-cdn.jtvnw.net/jtv_user_pictures/${user.twitchId}-profile_image-110x110.png" onerror="this.style.display='none'" alt="Twitch Avatar" style="cursor:pointer;">
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <a href="https://twitch.tv/${user.twitchUsername}" target="_blank" style="font-size:2.1em;font-weight:800;color:#a78bfa;text-decoration:none;line-height:1.1;">${user.twitchUsername}</a>
                    <span style="color:#888;font-size:1.1em;">Профиль Twitch</span>
                </div>
                <button id="twitchLogoutBtn" class="twitch-logout-btn" style="margin-left:auto;display:flex;align-items:center;gap:8px;padding:8px 18px;font-size:1.1em;font-weight:600;background:#a78bfa;color:#fff;border:none;border-radius:10px;box-shadow:0 2px 12px #a78bfa33;cursor:pointer;transition:background 0.2s,transform 0.18s;">
                    <i class="fab fa-twitch" style="font-size:1.2em;"></i> Выйти из Twitch
                </button>
            </div>
        `;
        setTimeout(() => {
            const logoutBtn = document.getElementById('twitchLogoutBtn');
            if (logoutBtn) logoutBtn.onclick = this.logoutTwitch.bind(this);
            const twitchProfileAvatar = document.getElementById('twitchProfileAvatar');
            if (twitchProfileAvatar) {
                twitchProfileAvatar.onclick = () => window.open(`https://twitch.tv/${user.twitchUsername}`, '_blank');
            }
        }, 0);
        try {
            const resp = await fetch('/api/twitch/subscriptions', { credentials: 'include' });
            if (!resp.ok) {
                if (resp.status === 401) {
                    this.pages.twitchProfile.innerHTML = `
                        <div class="twitch-error">Twitch-аккаунт не авторизован или истёк токен.<br>
                        <button id="reconnectTwitchBtn" class="twitch-logout-btn" style="margin-top:18px;"><i class='fab fa-twitch'></i> Переподключить Twitch</button>
                        </div>
                    `;
                    setTimeout(() => {
                        const btn = document.getElementById('reconnectTwitchBtn');
                        if (btn) btn.onclick = () => { window.location.href = '/auth/twitch'; };
                    }, 0);
                    return;
                } else {
                    this.pages.twitchProfile.innerHTML = `
                        <div class="twitch-error">Ошибка загрузки подписок Twitch (код ${resp.status}).<br>
                        <button id="reconnectTwitchBtn" class="twitch-logout-btn" style="margin-top:18px;"><i class='fab fa-twitch'></i> Переподключить Twitch</button>
                        </div>
                    `;
                    setTimeout(() => {
                        const btn = document.getElementById('reconnectTwitchBtn');
                        if (btn) btn.onclick = () => { window.location.href = '/auth/twitch'; };
                    }, 0);
                    return;
                }
            }
            const data = await resp.json();
            const liveIds = new Set((data.live||[]).map(s => s.user_id));
            const online = (data.subscriptions||[]).filter(s => liveIds.has(s.to_id));
            const offline = (data.subscriptions||[]).filter(s => !liveIds.has(s.to_id));
            let html = '';
            if (online.length > 0) {
                html += '<div class="twitch-section-title" style="font-size:1.5em;font-weight:800;color:#a78bfa;letter-spacing:1px;margin:18px 0 10px 0;text-shadow:0 2px 12px #a78bfa33;">Онлайн</div>';
                html += online.map(sub =>
                    `<div class="twitch-sub-item twitch-sub-online" style="display:flex;align-items:center;gap:18px;" data-twitch-id="${sub.to_id}" data-twitch-name="${sub.to_login}">
                        <img class="twitch-sub-avatar" src="${sub.avatar_url || ''}" onerror="this.style.display='none'" style="cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">
                        <span class="twitch-sub-name" style="font-weight:600;color:#fff;font-size:1.1em;cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">${sub.to_name}</span>
                        <button class="btn btn-secondary btn-watch-stream" style="margin-left:auto;" data-twitch-name="${sub.to_login}">Смотреть</button>
                    </div>`
                ).join('');
            }
            if (offline.length > 0) {
                if (online.length > 0) html += '<div class="twitch-section-title" style="font-size:1.2em;font-weight:700;color:#888;margin:18px 0 10px 0;">Офлайн</div>';
                else html += '<div class="twitch-section-title" style="font-size:1.2em;font-weight:700;color:#888;margin:18px 0 10px 0;">Офлайн</div>';
                html += offline.map(sub =>
                    `<div class="twitch-sub-item" style="display:flex;align-items:center;gap:18px;" data-twitch-id="${sub.to_id}" data-twitch-name="${sub.to_login}">
                        <img class="twitch-sub-avatar" src="${sub.avatar_url || ''}" onerror="this.style.display='none'" style="cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">
                        <span class="twitch-sub-name" style="font-weight:600;color:#aaa;font-size:1.1em;cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">${sub.to_name}</span>
                    </div>`
                ).join('');
            }
            if (!online.length && !offline.length) {
                html = '<div class="twitch-empty">Нет подписок.</div>';
            }
            this.pages.twitchProfile.innerHTML = html;
            Array.from(this.pages.twitchProfile.querySelectorAll('.btn-watch-stream')).forEach(btn => {
                btn.onclick = function(e) {
                    e.preventDefault();
                    const channel = btn.getAttribute('data-twitch-name');
                    if (channel) openTwitchPlayer(channel);
                };
            });
        } catch (e) {
            this.pages.twitchProfile.innerHTML = '<div class="twitch-error">Ошибка загрузки подписок.</div>';
        }
    }

    async logoutTwitch() {
        try {
            const resp = await fetch('/api/twitch/logout', { method: 'POST', credentials: 'include' });
            if (!resp.ok) throw new Error('Ошибка выхода из Twitch');
            if (this.authManager) {
                await this.authManager.checkServerSession();
                this.authManager.checkAuth();
                this.authManager.updateProfileDisplay();
            }
            this.showPage('account');
            if (this.showNotification) this.showNotification('Twitch-аккаунт отвязан', 'info');
        } catch (e) {
            if (this.showNotification) this.showNotification('Ошибка выхода из Twitch', 'error');
        }
    }
}

function showPage(pageName) {
    if (window.app) {
        window.app.showPage(pageName);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

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
        avatar.classList.add('profile-icon-animate');
        avatar.style.cursor = 'pointer';
        avatar.addEventListener('click', () => {
            modal.classList.add('animated-scale-in');
            modal.style.display = 'flex';
            modalImg.src = avatar.src;
            setTimeout(() => {
                modal.classList.remove('animated-scale-in');
            }, 350);
        });
    }
    if (modalClose) modalClose.addEventListener('click', () => {
        modal.classList.add('animated-fade-out');
        setTimeout(() => {
            modal.style.display = 'none';
            modalImg.src = '';
            modalCopied.style.display = 'none';
            modal.classList.remove('animated-fade-out');
        }, 350);
    });
    if (modalBackdrop) modalBackdrop.addEventListener('click', () => {
        modal.classList.add('animated-fade-out');
        setTimeout(() => {
            modal.style.display = 'none';
            modalImg.src = '';
            modalCopied.style.display = 'none';
            modal.classList.remove('animated-fade-out');
        }, 350);
    });
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex' && e.key === 'Escape') closeAvatarModal();
    });
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

    const twitchUsernameEl = document.getElementById('accountTwitchUsername');
    const twitchProfilePage = document.getElementById('twitchProfilePage');
    const accountPage = document.getElementById('accountPage');
    const backToAccountBtn = document.getElementById('backToAccountBtn');
    const twitchProfileInfo = document.getElementById('twitchProfileInfo');
    const twitchSubscriptionsList = document.getElementById('twitchSubscriptionsList');
    const twitchLiveStreams = document.getElementById('twitchLiveStreams');
    const twitchPlayerContainer = document.getElementById('twitchPlayerContainer');

    function showTwitchProfilePage() {
        showPage('twitchProfile');
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
            twitchPlayerContainer.innerHTML = '';
            return;
        }
        twitchProfileInfo.innerHTML = `
            <div class="twitch-profile-user-block" style="display:flex;align-items:center;gap:22px;margin-bottom:24px;">
                <img class="twitch-avatar" id="twitchProfileAvatar" src="https://static-cdn.jtvnw.net/jtv_user_pictures/${user.twitchId}-profile_image-110x110.png" onerror="this.style.display='none'" alt="Twitch Avatar" style="cursor:pointer;">
                <div style="display:flex;flex-direction:column;gap:6px;">
                    <a href="https://twitch.tv/${user.twitchUsername}" target="_blank" style="font-size:2.1em;font-weight:800;color:#a78bfa;text-decoration:none;line-height:1.1;">${user.twitchUsername}</a>
                    <span style="color:#888;font-size:1.1em;">Профиль Twitch</span>
                </div>
                <button id="twitchLogoutBtn" class="twitch-back-btn" style="margin-left:auto;">Выйти из Twitch</button>
            </div>
        `;
        setTimeout(() => {
            const logoutBtn = document.getElementById('twitchLogoutBtn');
            if (logoutBtn) logoutBtn.onclick = logoutTwitch;
            const twitchProfileAvatar = document.getElementById('twitchProfileAvatar');
            if (twitchProfileAvatar) {
                twitchProfileAvatar.onclick = () => window.open(`https://twitch.tv/${user.twitchUsername}`, '_blank');
            }
        }, 0);
        twitchSubscriptionsList.innerHTML = '<div class="twitch-loading">Загрузка подписок...</div>';
        twitchPlayerContainer.innerHTML = '';
        try {
            const resp = await fetch('/api/twitch/subscriptions', { credentials: 'include' });
            if (!resp.ok) throw new Error('Ошибка Twitch API');
            const data = await resp.json();
            const liveIds = new Set((data.live||[]).map(s => s.user_id));
            const online = (data.subscriptions||[]).filter(s => liveIds.has(s.to_id));
            const offline = (data.subscriptions||[]).filter(s => !liveIds.has(s.to_id));
            let html = '';
            if (online.length > 0) {
                html += '<div class="twitch-section-title" style="font-size:1.5em;font-weight:800;color:#a78bfa;letter-spacing:1px;margin:18px 0 10px 0;text-shadow:0 2px 12px #a78bfa33;">Онлайн</div>';
                html += online.map(sub =>
                    `<div class="twitch-sub-item twitch-sub-online" style="display:flex;align-items:center;gap:18px;" data-twitch-id="${sub.to_id}" data-twitch-name="${sub.to_login}">
                        <img class="twitch-sub-avatar" src="${sub.avatar_url || ''}" onerror="this.style.display='none'" style="cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">
                        <span class="twitch-sub-name" style="font-weight:600;color:#fff;font-size:1.1em;cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">${sub.to_name}</span>
                        <button class="btn btn-secondary btn-watch-stream" style="margin-left:auto;" data-twitch-name="${sub.to_login}">Смотреть</button>
                    </div>`
                ).join('');
            }
            if (offline.length > 0) {
                if (online.length > 0) html += '<div class="twitch-section-title" style="font-size:1.2em;font-weight:700;color:#888;margin:18px 0 10px 0;">Офлайн</div>';
                else html += '<div class="twitch-section-title" style="font-size:1.2em;font-weight:700;color:#888;margin:18px 0 10px 0;">Офлайн</div>';
                html += offline.map(sub =>
                    `<div class="twitch-sub-item" style="display:flex;align-items:center;gap:18px;" data-twitch-id="${sub.to_id}" data-twitch-name="${sub.to_login}">
                        <img class="twitch-sub-avatar" src="${sub.avatar_url || ''}" onerror="this.style.display='none'" style="cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">
                        <span class="twitch-sub-name" style="font-weight:600;color:#aaa;font-size:1.1em;cursor:pointer;" onclick="window.open('${sub.twitch_url}','_blank')">${sub.to_name}</span>
                    </div>`
                ).join('');
            }
            if (!online.length && !offline.length) {
                html = '<div class="twitch-empty">Нет подписок.</div>';
            }
            twitchSubscriptionsList.innerHTML = html;
            Array.from(twitchSubscriptionsList.querySelectorAll('.btn-watch-stream')).forEach(btn => {
                btn.onclick = function(e) {
                    e.preventDefault();
                    const channel = btn.getAttribute('data-twitch-name');
                    if (channel) openTwitchPlayer(channel);
                };
            });
        } catch (e) {
            twitchSubscriptionsList.innerHTML = '<div class="twitch-error">Ошибка загрузки подписок.</div>';
        }
    }
    if (twitchSubscriptionsList) {
        twitchSubscriptionsList.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-watch-stream');
            if (btn) {
                const channel = btn.getAttribute('data-twitch-name');
                if (channel) {
                    openTwitchPlayer(channel);
                }
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            if (window.app?.authManager) {
                window.app.authManager.logout();
            }
        };
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.pay-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const coins = parseInt(btn.getAttribute('data-coins'));
            // Создаем уникальный ID заказа
            const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            // Сначала создаем платеж на сервере
            fetch('/api/donate/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderId, amount: calcPrice(coins), coins })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.paymentUrl) {
                    // Открываем ЮMoney виджет
                    const checkout = new window.YooKassa.Checkout({
                        confirmation_token: data.confirmationToken,
                        return_url: window.location.origin + '/profile/donate'
                    });
                    checkout.render('payment-form');
                    checkout.on('success', function(event) {
                        showCustomNotification('Оплата успешна! Монеты будут зачислены после подтверждения.', 'success');
                    });
                } else if (data.error && data.error.includes('ЮKassa не настроена')) {
                    showCustomNotification('Оплата временно недоступна. ЮKassa ещё не подключена.', 'warn');
                } else {
                    showCustomNotification('Ошибка оплаты: ' + (data.error || 'Неизвестная ошибка'), 'error');
                }
            })
            .catch(() => {
                showCustomNotification('Ошибка связи с сервером оплаты.', 'error');
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const donateRange = document.getElementById('donateRange');
  const donateRangeValue = document.getElementById('donateRangeValue');
  const donateRangePrice = document.getElementById('donateRangePrice');
  const quickBtns = document.querySelectorAll('.donate-quick-btn');
  const payBtn = document.getElementById('donatePayBtn');

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
      if (typeof startYooKassaPayment === 'function') {
        startYooKassaPayment(amount, coins);
      } else {
        showCustomNotification('Оплата: ' + amount + '₽ за ' + coins + ' монет', 'info');
      }
    });
  }
});


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

async function logoutTwitch() {
    try {
        const resp = await fetch('/api/twitch/logout', { method: 'POST', credentials: 'include' });
        if (!resp.ok) throw new Error('Ошибка выхода из Twitch');
        if (window.app?.authManager) {
            await window.app.authManager.checkServerSession();
            window.app.authManager.checkAuth();
            window.app.authManager.updateProfileDisplay();
        }
        showAccountPage();
        if (window.app?.showNotification) window.app.showNotification('Twitch-аккаунт отвязан', 'info');
    } catch (e) {
        if (window.app?.showNotification) window.app.showNotification('Ошибка выхода из Twitch', 'error');
    }
}

const accountAvatar = document.getElementById('accountAvatar');
const avatarModal = document.getElementById('avatarModal');
const avatarModalImg = document.getElementById('avatarModalImg');
if (accountAvatar && avatarModal && avatarModalImg) {
    accountAvatar.addEventListener('click', () => {
        avatarModal.style.display = 'flex';
        avatarModalImg.src = accountAvatar.src;
        avatarModalImg.classList.add('avatar-modal-animate');
        setTimeout(() => {
            avatarModalImg.classList.remove('avatar-modal-animate');
        }, 600);
    });
    avatarModal.addEventListener('click', (e) => {
        if (e.target === avatarModal || e.target.classList.contains('avatar-modal-close') || e.target.classList.contains('avatar-modal-backdrop')) {
            avatarModal.style.display = 'none';
            avatarModalImg.src = '';
        }
    });
}

const twitchPlayerModal = document.getElementById('twitchPlayerModal');
const twitchPlayerIframeContainer = document.getElementById('twitchPlayerIframeContainer');
const twitchPlayerCloseBtn = document.getElementById('twitchPlayerCloseBtn');
let currentTwitchChannel = null;
function openTwitchPlayer(channel) {
    if (!twitchPlayerModal || !twitchPlayerIframeContainer) return;
    if (currentTwitchChannel === channel) return; // уже открыт этот канал
    currentTwitchChannel = channel;
    twitchPlayerIframeContainer.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}" allowfullscreen frameborder="0"></iframe>`;
    twitchPlayerModal.style.display = 'flex';
    setTimeout(() => {
        twitchPlayerModal.classList.add('show');
    }, 10);
}
function closeTwitchPlayer() {
    if (!twitchPlayerModal) return;
    twitchPlayerModal.classList.remove('show');
    setTimeout(() => {
        twitchPlayerModal.style.display = 'none';
        twitchPlayerIframeContainer.innerHTML = '';
        currentTwitchChannel = null;
    }, 250);
}
if (twitchPlayerCloseBtn) {
    twitchPlayerCloseBtn.onclick = closeTwitchPlayer;
}
if (twitchPlayerModal) {
    twitchPlayerModal.classList.add('animated-fade-in');
    setTimeout(() => {
        twitchPlayerModal.classList.remove('animated-fade-in');
    }, 350);
    twitchPlayerModal.addEventListener('click', (e) => {
        if (e.target === twitchPlayerModal || e.target.classList.contains('twitch-player-backdrop')) {
            twitchPlayerModal.classList.add('animated-fade-out');
            setTimeout(() => {
                twitchPlayerModal.style.display = 'none';
                twitchPlayerIframeContainer.innerHTML = '';
                currentTwitchChannel = null;
                twitchPlayerModal.classList.remove('animated-fade-out');
            }, 350);
        }
    });
}
if (twitchSubscriptionsList) {
    twitchSubscriptionsList.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-watch-stream');
        if (btn) {
            const channel = btn.getAttribute('data-twitch-name');
            if (channel) {
                openTwitchPlayer(channel);
            }
        }
    });
} 

const twitchChatToggle = document.getElementById('twitchChatToggle');
const twitchChatContainer = document.getElementById('twitchChatContainer');
const twitchChatClose = document.getElementById('twitchChatClose');
const twitchChatMessages = document.getElementById('twitchChatMessages');
const twitchChatInput = document.getElementById('twitchChatInput');
const twitchChatSend = document.getElementById('twitchChatSend');
const twitchChatSticker = document.getElementById('twitchChatSticker');
const twitchChatStickers = document.getElementById('twitchChatStickers');

const stickers = ['😀','😂','😍','😎','🔥','👍','🎉','🥳','😈','💜','👾','🤘','😺','🥲','😭','😡','🤡','👻','💩','🍕'];

function renderStickers() {
    twitchChatStickers.innerHTML = '';
    stickers.forEach(sticker => {
        const btn = document.createElement('span');
        btn.className = 'twitch-chat-sticker-item';
        btn.textContent = sticker;
        btn.onclick = () => {
            twitchChatInput.value += sticker;
            twitchChatStickers.style.display = 'none';
            twitchChatInput.focus();
        };
        twitchChatStickers.appendChild(btn);
    });
}
renderStickers();

function openChat() {
    twitchChatContainer.style.display = 'flex';
    twitchChatContainer.classList.remove('hide');
    twitchChatContainer.classList.add('animated-slide-in-up');
    setTimeout(() => {
        twitchChatContainer.classList.remove('animated-slide-in-up');
    }, 380);
    twitchChatToggle.style.display = 'none';
}
function closeChat() {
    twitchChatContainer.classList.add('hide');
    twitchChatContainer.classList.add('animated-slide-out-down');
    setTimeout(() => {
        twitchChatContainer.style.display = 'none';
        twitchChatContainer.classList.remove('animated-slide-out-down');
        twitchChatContainer.classList.remove('hide');
        twitchChatToggle.style.display = 'flex';
    }, 320);
}
if (twitchChatToggle) {
    twitchChatToggle.onclick = openChat;
}
if (twitchChatClose) {
    twitchChatClose.onclick = closeChat;
}
if (twitchChatSticker) {
    twitchChatSticker.onclick = () => {
        twitchChatStickers.style.display = twitchChatStickers.style.display === 'none' ? 'flex' : 'none';
    };
}
if (twitchChatSend) {
    twitchChatSend.onclick = sendMessage;
}
if (twitchChatInput) {
    twitchChatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}
function sendMessage() {
    const text = twitchChatInput.value.trim();
    if (!text) return;
    addMessage(text, true);
    twitchChatInput.value = '';
    twitchChatStickers.style.display = 'none';
}
function addMessage(text, self = false) {
    const msg = document.createElement('div');
    msg.className = 'twitch-chat-message' + (self ? ' self' : '');
    msg.textContent = text;
    twitchChatMessages.appendChild(msg);
    twitchChatMessages.scrollTop = twitchChatMessages.scrollHeight;
} 