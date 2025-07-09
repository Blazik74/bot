class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'dark',
            headerCustomization: {
                showLogo: true,
                showNavLinks: true,
                backgroundColor: 'default',
                blurEffect: true
            },
            animations: {
                enabled: true,
                particleCount: 30,
                transitionSpeed: 'normal'
            },
            notifications: {
                enabled: true,
                sound: false,
                desktop: false
            },
            accessibility: {
                highContrast: false,
                reducedMotion: false,
                fontSize: 'medium'
            }
        };
        
        this.themes = {
            dark: {
                name: 'Тёмная',
                description: 'Классическая тёмная тема',
                icon: 'fas fa-moon'
            },
            light: {
                name: 'Светлая',
                description: 'Светлая тема для дневного времени',
                icon: 'fas fa-sun'
            },
            purple: {
                name: 'Фиолетовая',
                description: 'Мистическая фиолетовая тема',
                icon: 'fas fa-magic'
            },
            cyber: {
                name: 'Киберпанк',
                description: 'Футуристическая зелёная тема',
                icon: 'fas fa-robot'
            },
            sunset: {
                name: 'Закат',
                description: 'Тёплая оранжевая тема',
                icon: 'fas fa-sunset'
            }
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.applySettings();
        this.setupEventListeners();
        this.renderSettingsPage();
    }

    async loadSettings() {
        const savedSettings = localStorage.getItem('arness_settings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (error) {
                console.error('Ошибка загрузки настроек:', error);
            }
        }
        
        await this.loadServerSettings();
    }

    async loadServerSettings() {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const data = await response.json();
                if (data.settings && Object.keys(data.settings).length > 0) {
                    this.settings = { ...this.settings, ...data.settings };
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки настроек с сервера:', error);
        }
    }

    async saveSettings() {
        localStorage.setItem('arness_settings', JSON.stringify(this.settings));
        
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ settings: this.settings })
            });
        } catch (error) {
            console.error('Ошибка сохранения настроек на сервер:', error);
        }
    }

    applySettings() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        
        this.applyAnimationSettings();
        
        this.applyHeaderCustomization();
        
        this.applyAccessibilitySettings();
    }

    applyAnimationSettings() {
        const body = document.body;
        
        if (!this.settings.animations.enabled) {
            body.style.setProperty('--transition-speed', '0s');
            body.style.setProperty('--bounce-timing', 'linear');
        } else {
            const speed = this.settings.animations.transitionSpeed;
            const speedValue = speed === 'fast' ? '0.2s' : speed === 'slow' ? '0.5s' : '0.3s';
            body.style.setProperty('--transition-speed', speedValue);
            body.style.setProperty('--bounce-timing', 'cubic-bezier(0.68, -0.55, 0.265, 1.55)');
        }
        
        this.updateParticleCount();
    }

    animateToggle(element, show) {
        if (!element) return;
        if (show) {
            element.classList.remove('fade-out', 'hidden');
            element.classList.add('fade-in');
        } else {
            element.classList.remove('fade-in');
            element.classList.add('fade-out');
            element.addEventListener('transitionend', function handler() {
                element.classList.add('hidden');
                element.removeEventListener('transitionend', handler);
            });
        }
    }

    applyHeaderCustomization() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const customization = this.settings.headerCustomization;
        
        const logo = navbar.querySelector('.nav-logo');
        if (logo) {
            this.animateToggle(logo, customization.showLogo);
        }
        
        const navLinks = navbar.querySelector('.nav-links');
        if (navLinks) {
            this.animateToggle(navLinks, customization.showNavLinks);
        }
        
        if (customization.backgroundColor !== 'default') {
            navbar.style.backgroundColor = customization.backgroundColor;
        } else {
            navbar.style.backgroundColor = '';
        }
        
        if (customization.blurEffect) {
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backdropFilter = 'none';
        }
    }

    applyAccessibilitySettings() {
        const body = document.body;
        const accessibility = this.settings.accessibility;
        
        if (accessibility.highContrast) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
        
        if (accessibility.reducedMotion) {
            body.classList.add('reduced-motion');
        } else {
            body.classList.remove('reduced-motion');
        }
        
        const fontSizeMap = {
            small: '0.9rem',
            medium: '1rem',
            large: '1.2rem',
            xlarge: '1.4rem'
        };
        
        body.style.fontSize = fontSizeMap[accessibility.fontSize] || '1rem';
    }

    updateParticleCount() {
        const bgAnimation = document.getElementById('bg-animation');
        if (!bgAnimation) return;

        const existingParticles = bgAnimation.querySelectorAll('.particle');
        existingParticles.forEach(particle => particle.remove());

        if (this.settings.animations.enabled) {
            this.createParticles(this.settings.animations.particleCount);
        }
    }

    createParticles(count) {
        const bgAnimation = document.getElementById('bg-animation');
        if (!bgAnimation) return;

        for (let i = 0; i < count; i++) {
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

    setupEventListeners() {
    }

    renderSettingsPage() {
        const settingsContainer = document.querySelector('.settings-section');
        if (!settingsContainer) return;

        settingsContainer.innerHTML = `
            <h2>Настройки</h2>
            
            <!-- Темы -->
            <div class="setting-card">
                <h3 class="setting-title">
                    <i class="fas fa-palette"></i>
                    Тема оформления
                </h3>
                <p>Выберите подходящую тему для сайта</p>
                <div class="theme-selector">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option ${key} ${this.settings.theme === key ? 'active' : ''}" 
                             data-theme="${key}" 
                             title="${theme.description}">
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Кастомизация шапки -->
            <div class="setting-card">
                <h3 class="setting-title">
                    <i class="fas fa-header"></i>
                    Кастомизация шапки
                </h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="showLogo" ${this.settings.headerCustomization.showLogo ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Показывать логотип</span>
                    </div>
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="showNavLinks" ${this.settings.headerCustomization.showNavLinks ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Показывать навигацию</span>
                    </div>
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="blurEffect" ${this.settings.headerCustomization.blurEffect ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Эффект размытия</span>
                    </div>
                </div>
            </div>

            <!-- Анимации -->
            <div class="setting-card">
                <h3 class="setting-title">
                    <i class="fas fa-magic"></i>
                    Анимации
                </h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="animationsEnabled" ${this.settings.animations.enabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Включить анимации</span>
                    </div>
                    <div class="setting-item">
                        <label>Количество частиц:</label>
                        <input type="range" id="particleCount" min="10" max="50" value="${this.settings.animations.particleCount}">
                        <span id="particleCountValue">${this.settings.animations.particleCount}</span>
                    </div>
                    <div class="setting-item">
                        <label>Скорость переходов:</label>
                        <select id="transitionSpeed">
                            <option value="fast" ${this.settings.animations.transitionSpeed === 'fast' ? 'selected' : ''}>Быстро</option>
                            <option value="normal" ${this.settings.animations.transitionSpeed === 'normal' ? 'selected' : ''}>Нормально</option>
                            <option value="slow" ${this.settings.animations.transitionSpeed === 'slow' ? 'selected' : ''}>Медленно</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Уведомления -->
            <div class="setting-card">
                <h3 class="setting-title">
                    <i class="fas fa-bell"></i>
                    Уведомления
                </h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="notificationsEnabled" ${this.settings.notifications.enabled ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Включить уведомления</span>
                    </div>
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="notificationSound" ${this.settings.notifications.sound ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Звуковые уведомления</span>
                    </div>
                </div>
            </div>

            <!-- Доступность -->
            <div class="setting-card">
                <h3 class="setting-title">
                    <i class="fas fa-universal-access"></i>
                    Доступность
                </h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="highContrast" ${this.settings.accessibility.highContrast ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Высокий контраст</span>
                    </div>
                    <div class="setting-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="reducedMotion" ${this.settings.accessibility.reducedMotion ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                        </label>
                        <span>Уменьшенное движение</span>
                    </div>
                    <div class="setting-item">
                        <label>Размер шрифта:</label>
                        <select id="fontSize">
                            <option value="small" ${this.settings.accessibility.fontSize === 'small' ? 'selected' : ''}>Маленький</option>
                            <option value="medium" ${this.settings.accessibility.fontSize === 'medium' ? 'selected' : ''}>Средний</option>
                            <option value="large" ${this.settings.accessibility.fontSize === 'large' ? 'selected' : ''}>Большой</option>
                            <option value="xlarge" ${this.settings.accessibility.fontSize === 'xlarge' ? 'selected' : ''}>Очень большой</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Кнопки управления -->
            <div class="settings-actions">
                <button class="btn btn-primary" id="saveSettings">Сохранить настройки</button>
                <button class="btn btn-secondary" id="resetSettings">Сбросить к умолчаниям</button>
                <button class="btn btn-secondary" id="logoutSettingsBtn">Выйти из аккаунта</button>
            </div>
        `;

        this.setupSettingsEventListeners();
    }

    setupSettingsEventListeners() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.changeTheme(theme);
            });
        });

        const toggles = [
            'showLogo', 'showNavLinks', 'blurEffect', 'animationsEnabled',
            'notificationsEnabled', 'notificationSound', 'highContrast', 'reducedMotion'
        ];

        toggles.forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.addEventListener('change', () => {
                    this.updateSetting(toggleId, toggle.checked);
                });
            }
        });

        const particleSlider = document.getElementById('particleCount');
        const particleValue = document.getElementById('particleCountValue');
        if (particleSlider && particleValue) {
            particleSlider.addEventListener('input', () => {
                const value = particleSlider.value;
                particleValue.textContent = value;
                this.updateSetting('particleCount', parseInt(value));
            });
        }

        const selects = ['transitionSpeed', 'fontSize'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.addEventListener('change', () => {
                    this.updateSetting(selectId, select.value);
                });
            }
        });

        const saveBtn = document.getElementById('saveSettings');
        const resetBtn = document.getElementById('resetSettings');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
                this.showNotification('Настройки сохранены!', 'success');
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }

        const logoutSettingsBtn = document.getElementById('logoutSettingsBtn');
        if (logoutSettingsBtn && window.AuthManager) {
            logoutSettingsBtn.addEventListener('click', () => {
                window.AuthManager.logout();
            });
        }
    }

    changeTheme(theme) {
        this.settings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`)?.classList.add('active');
        
        this.saveSettings();
        this.showNotification(`Тема изменена на "${this.themes[theme].name}"`, 'success');
    }

    updateSetting(key, value) {
        if (key === 'showLogo' || key === 'showNavLinks' || key === 'blurEffect') {
            this.settings.headerCustomization[key] = value;
        } else if (key === 'animationsEnabled' || key === 'particleCount' || key === 'transitionSpeed') {
            this.settings.animations[key] = value;
        } else if (key === 'notificationsEnabled' || key === 'notificationSound') {
            this.settings.notifications[key] = value;
        } else if (key === 'highContrast' || key === 'reducedMotion' || key === 'fontSize') {
            this.settings.accessibility[key] = value;
        }

        this.applySettings();
    }

    resetToDefaults() {
        if (confirm('Вы уверены, что хотите сбросить все настройки к умолчаниям?')) {
            this.settings = {
                theme: 'dark',
                headerCustomization: {
                    showLogo: true,
                    showNavLinks: true,
                    backgroundColor: 'default',
                    blurEffect: true
                },
                animations: {
                    enabled: true,
                    particleCount: 30,
                    transitionSpeed: 'normal'
                },
                notifications: {
                    enabled: true,
                    sound: false,
                    desktop: false
                },
                accessibility: {
                    highContrast: false,
                    reducedMotion: false,
                    fontSize: 'medium'
                }
            };
            
            this.saveSettings();
            this.applySettings();
            this.renderSettingsPage();
            this.showNotification('Настройки сброшены к умолчаниям', 'info');
        }
    }

    showNotification(message, type = 'info') {
        if (window.AuthManager) {
            window.AuthManager.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    getSettings() {
        return this.settings;
    }

    getThemes() {
        return this.themes;
    }
}

window.SettingsManager = SettingsManager; 