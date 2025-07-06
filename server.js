const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const app = express();

// Конфигурация
const CLIENT_ID = '1391384219661500558';
const CLIENT_SECRET = 'jN3YUbVedyFfveM_FQXi2mXd1C_6Jewj';
const REDIRECT_URI = 'https://arness-community.onrender.com';
const PORT = process.env.PORT || 3000;

// --- Twitch OAuth ---
const TWITCH_CLIENT_ID = '7pewyshzfymoj5at2odselalrjj1gm';
const TWITCH_CLIENT_SECRET = '8c4uuj3b4eq2v9dm6pnnowd68hgekf';
const TWITCH_REDIRECT_URI = 'https://arness-community.onrender.com/auth/twitch/callback';

// Подключение к PostgreSQL
const pool = new Pool({
    connectionString: 'postgresql://pixel_ai_backend_user:oGyzFo623gOhMz8ZsDx1yvPF3vjJjtgO@dpg-d1ehca6uk2gs73anldu0-a/pixel_ai_backend',
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'arness-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // установите true для HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// Инициализация базы данных
async function initDatabase() {
    try {
        const client = await pool.connect();
        
        // Создание таблицы пользователей
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                discord_id VARCHAR(255) UNIQUE,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                password_hash VARCHAR(255),
                avatar_url TEXT,
                settings JSONB DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Проверяем, существует ли колонка discord_id
        const columnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'discord_id'
        `);

        // Если колонки нет, добавляем её
        if (columnCheck.rows.length === 0) {
            console.log('Добавляем колонку discord_id...');
            await client.query(`
                ALTER TABLE users 
                ADD COLUMN discord_id VARCHAR(255) UNIQUE
            `);
        }

        // Создание индексов (только если они не существуют)
        try {
            await client.query(`CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id)`);
        } catch (indexError) {
            console.log('Индекс idx_users_discord_id уже существует или не может быть создан');
        }

        try {
            await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
        } catch (indexError) {
            console.log('Индекс idx_users_email уже существует или не может быть создан');
        }

        console.log('База данных инициализирована');
        client.release();
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
        // Не завершаем процесс, позволяем серверу запуститься
    }
}

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API для регистрации
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Валидация
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
        }

        // Проверка существования пользователя
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        // Хеширование пароля
        const passwordHash = await bcrypt.hash(password, 10);

        // Создание пользователя
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password_hash, avatar_url) 
             VALUES ($1, $2, $3, $4) RETURNING id, username, email, avatar_url, created_at`,
            [username, email, passwordHash, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`]
        );

        const user = newUser.rows[0];
        
        // Создание сессии
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_url,
            registrationDate: user.created_at.toLocaleDateString()
        };

        res.json({
            success: true,
            user: req.session.user
        });

    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для входа
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Валидация
        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }

        // Поиск пользователя
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }

        const user = userResult.rows[0];

        // Проверка пароля
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Неверный email или пароль' });
        }

        // Создание сессии
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_url,
            registrationDate: user.created_at.toLocaleDateString(),
            discordId: user.discord_id
        };

        res.json({
            success: true,
            user: req.session.user
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для выхода
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка выхода' });
        }
        res.json({ success: true });
    });
});

// API для проверки авторизации
app.get('/api/auth/check', (req, res) => {
    if (req.session.user) {
        res.json({ 
            authenticated: true, 
            user: req.session.user 
        });
    } else {
        res.json({ authenticated: false });
    }
});

// Вспомогательная функция для обработки Discord пользователей
async function handleDiscordUser(discordUser) {
    let user;
    try {
        // Сначала пытаемся найти пользователя по discord_id
        user = await pool.query(
            'SELECT * FROM users WHERE discord_id = $1',
            [discordUser.id]
        );

        if (user.rows.length === 0) {
            // Создание нового пользователя с discord_id
            const newUser = await pool.query(
                `INSERT INTO users (discord_id, username, name, email, avatar_url, role) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    discordUser.id,
                    discordUser.username,
                    discordUser.username,
                    discordUser.email,
                    discordUser.avatar ? 
                        `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : 
                        'https://cdn.discordapp.com/embed/avatars/0.png',
                    'user'
                ]
            );
            user = newUser;
        }
    } catch (dbError) {
        console.error('Ошибка работы с БД при Discord авторизации:', dbError);
        // Если колонка discord_id не существует, создаем пользователя без неё
        try {
            const newUser = await pool.query(
                `INSERT INTO users (username, name, email, avatar_url, role) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [
                    discordUser.username,
                    discordUser.username,
                    discordUser.email,
                    discordUser.avatar ? 
                        `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : 
                        'https://cdn.discordapp.com/embed/avatars/0.png',
                    'user'
                ]
            );
            user = newUser;
        } catch (insertError) {
            console.error('Ошибка создания пользователя:', insertError);
            throw new Error('Не удалось создать пользователя');
        }
    }
    
    return user.rows[0];
}

// API для сохранения настроек
app.post('/api/settings', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const { settings } = req.body;

        await pool.query(
            'UPDATE users SET settings = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [JSON.stringify(settings), req.session.userId]
        );

        res.json({ success: true });

    } catch (error) {
        console.error('Ошибка сохранения настроек:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для получения настроек
app.get('/api/settings', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }

        const result = await pool.query(
            'SELECT settings FROM users WHERE id = $1',
            [req.session.userId]
        );

        const settings = result.rows[0]?.settings || {};
        res.json({ settings });

    } catch (error) {
        console.error('Ошибка получения настроек:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Discord OAuth2 callback
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect('/?error=no_code');
    }
    
    try {
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);
        
        // Обмен кода на токен
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { access_token } = tokenResponse.data;
        
        // Получение информации о пользователе
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const discordUser = userResponse.data;
        
        // Поиск или создание пользователя
        const userData = await handleDiscordUser(discordUser);
        
        // Создание сессии
        req.session.userId = userData.id;
        req.session.user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar_url,
            registrationDate: userData.created_at ? userData.created_at.toLocaleDateString() : new Date().toLocaleDateString(),
            discordId: userData.discord_id
        };
        
        // Перенаправляем обратно на сайт
        res.redirect('/?discord_success=true');
        
    } catch (error) {
        console.error('Discord OAuth error:', error);
        res.redirect('/?error=oauth_failed');
    }
});

// API endpoint для обработки Discord авторизации
app.post('/api/auth/discord', async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }
    
    try {
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);
        
        // Обмен кода на токен
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { access_token } = tokenResponse.data;
        
        // Получение информации о пользователе
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        
        const discordUser = userResponse.data;
        
        // Поиск или создание пользователя
        const userData = await handleDiscordUser(discordUser);
        
        // Создание сессии
        req.session.userId = userData.id;
        req.session.user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar_url,
            registrationDate: userData.created_at ? userData.created_at.toLocaleDateString() : new Date().toLocaleDateString(),
            discordId: userData.discord_id
        };
        
        res.json(req.session.user);
        
    } catch (error) {
        console.error('Discord OAuth error:', error);
        res.status(500).json({ error: 'OAuth failed' });
    }
});

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Не авторизован' });
    }
    next();
}

// Защищенные маршруты
app.get('/api/profile', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, avatar_url, created_at, settings FROM users WHERE id = $1',
            [req.session.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_url,
            registrationDate: user.created_at ? user.created_at.toLocaleDateString() : new Date().toLocaleDateString(),
            settings: user.settings || {}
        });

    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Endpoint для старта Twitch OAuth
app.get('/auth/twitch', (req, res) => {
    const scope = 'user:read:email';
    const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URI)}&response_type=code&scope=${scope}`;
    res.redirect(twitchAuthUrl);
});

// Callback Twitch OAuth
app.get('/auth/twitch/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/accountPage?error=twitch_no_code');
    try {
        // Получаем access_token
        const tokenResp = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: TWITCH_CLIENT_ID,
                client_secret: TWITCH_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: TWITCH_REDIRECT_URI
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const { access_token } = tokenResp.data;
        // Получаем данные пользователя
        const userResp = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': TWITCH_CLIENT_ID
            }
        });
        const twitchUser = userResp.data.data[0];
        // Сохраняем Twitch данные в профиле пользователя (если авторизован)
        if (req.session.userId) {
            await pool.query(
                'UPDATE users SET twitch_id = $1, twitch_username = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
                [twitchUser.id, twitchUser.login, req.session.userId]
            );
        }
        // Обновляем сессию
        if (req.session.user) {
            req.session.user.twitchId = twitchUser.id;
            req.session.user.twitchUsername = twitchUser.login;
        }
        // Перенаправляем обратно в профиль
        res.redirect('/?twitch_success=true');
    } catch (error) {
        console.error('Twitch OAuth error:', error);
        res.redirect('/?error=twitch_oauth_failed');
    }
});

// Инициализация и запуск сервера
async function startServer() {
    try {
        // Инициализируем БД, но не прерываем запуск сервера при ошибках
        await initDatabase().catch(error => {
            console.error('Предупреждение: Ошибка инициализации БД:', error.message);
            console.log('Сервер продолжит работу, но некоторые функции могут быть недоступны');
        });
        
        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
            console.log(`📱 Discord Client ID: ${CLIENT_ID}`);
            console.log(`🔗 Discord OAuth2 URL: https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`);
        });
    } catch (error) {
        console.error('Критическая ошибка запуска сервера:', error);
        process.exit(1);
    }
}

// Обработка ошибок
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    pool.end();
    process.exit(0);
});

startServer(); 
