const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);
const app = express();

// Получение переменных из process.env
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1391384219661500558';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'oGyzFo623gOhMz8ZsDx1yvPF3vjJjtgO';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://arness-community.onrender.com/auth/discord/callback';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('❌ Discord OAuth переменные не заданы! Проверьте .env');
  process.exit(1);
}

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
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET || 'arness-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
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

        // Проверяем, есть ли колонка settings
        const settingsCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'settings'
        `);
        if (settingsCol.rows.length === 0) {
            await client.query(`ALTER TABLE users ADD COLUMN settings JSONB DEFAULT '{}'`);
        }

        // Проверяем, есть ли колонка twitch_id
        const twitchIdCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'twitch_id'
        `);
        if (twitchIdCol.rows.length === 0) {
            await client.query(`ALTER TABLE users ADD COLUMN twitch_id VARCHAR(255)`);
        }
        // Проверяем, есть ли колонка twitch_username
        const twitchUsernameCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'twitch_username'
        `);
        if (twitchUsernameCol.rows.length === 0) {
            await client.query(`ALTER TABLE users ADD COLUMN twitch_username VARCHAR(255)`);
        }

        // Создаем таблицу donations если её нет
        await client.query(`
            CREATE TABLE IF NOT EXISTS donations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                order_id VARCHAR(255) UNIQUE NOT NULL,
                amount INTEGER NOT NULL,
                coins INTEGER NOT NULL,
                payment_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log('Таблица donations готова');

        // Создаем таблицу payments если её нет
        await client.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                order_id VARCHAR(255) UNIQUE NOT NULL,
                amount INTEGER NOT NULL,
                coins INTEGER NOT NULL,
                payment_id VARCHAR(255),
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        console.log('Таблица payments готова');

        console.log('База данных инициализирована');
        client.release();
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
        // Не завершаем процесс, позволяем серверу запуститься
    }
}

// Гарантируем наличие password_hash
async function ensurePasswordHashColumn() {
    try {
        const client = await pool.connect();
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);');
        client.release();
        console.log('Колонка password_hash гарантирована!');
    } catch (err) {
        console.error('Ошибка при добавлении password_hash:', err);
    }
}

// После инициализации базы данных создаём пользователя admin/0001, если его нет
async function createDefaultAdmin() {
    try {
        const client = await pool.connect();
        const check = await client.query('SELECT id FROM users WHERE email = $1', ['admin']);
        if (check.rows.length === 0) {
            const passwordHash = await bcrypt.hash('0001', 10);
            await client.query(
                `INSERT INTO users (username, name, email, password_hash, avatar_url, role) VALUES ($1, $2, $3, $4, $5, $6)`,
                ['admin', 'admin', 'admin', passwordHash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 'admin']
            );
            console.log('✅ Пользователь admin/0001 создан');
        } else {
            console.log('Пользователь admin уже существует');
        }
        client.release();
    } catch (err) {
        console.error('Ошибка создания пользователя admin:', err);
    }
}

// Автоматическое создание таблицы session для connect-pg-simple
async function ensureSessionTable() {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS "session" (
                "sid" varchar NOT NULL COLLATE "default",
                "sess" json NOT NULL,
                "expire" timestamp(6) NOT NULL
            ) WITH (OIDS=FALSE);
        `);
        await client.query(`
            ALTER TABLE "session" ADD CONSTRAINT IF NOT EXISTS "session_pkey" PRIMARY KEY ("sid");
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
        `);
        client.release();
        console.log('Таблица session для сессий готова');
    } catch (err) {
        console.error('Ошибка создания таблицы session:', err);
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

        // Проверка существования пользователя по email
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
        // Проверка существования пользователя по username
        const existingUsername = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );
        if (existingUsername.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким ником уже существует' });
        }

        // Хеширование пароля
        const passwordHash = await bcrypt.hash(password, 10);

        // Создание пользователя
        const newUser = await pool.query(
            `INSERT INTO users (username, name, email, password_hash, avatar_url, role) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, avatar_url, created_at`,
            [username, username, email, passwordHash, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, 'user']
        );
        const user = newUser.rows[0];
        
        // Создание сессии
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_url,
            registrationDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
            discordId: user.discord_id
        };

        res.json({ success: true, user: req.session.user });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Пользователь с таким ником уже существует' });
        }
        if (error.code === '23514') {
            return res.status(400).json({ error: 'Некорректные данные' });
        }
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API для входа
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Валидация
        if (!username || !password) {
            return res.status(400).json({ error: 'Ник и пароль обязательны' });
        }

        // Поиск пользователя по нику
        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный ник или пароль' });
        }

        const user = userResult.rows[0];

        // Проверка пароля
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Неверный ник или пароль' });
        }

        // Создание сессии
        req.session.userId = user.id;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar_url,
            registrationDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
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
app.get('/api/auth/check', async (req, res) => {
    if (req.session.userId) {
        try {
            const result = await pool.query(
                'SELECT id, username, email, avatar_url, created_at, discord_id, twitch_id, twitch_username FROM users WHERE id = $1',
                [req.session.userId]
            );
            if (result.rows.length === 0) {
                return res.json({ authenticated: false });
            }
            const user = result.rows[0];
            const userObj = {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar_url,
                registrationDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
                discordId: user.discord_id,
                twitchId: user.twitch_id,
                twitchUsername: user.twitch_username
            };
            // Обновляем сессию
            req.session.user = userObj;
            res.json({ authenticated: true, user: userObj });
        } catch (e) {
            return res.json({ authenticated: false });
        }
    } else {
        res.json({ authenticated: false });
    }
});

// Вспомогательная функция для обработки Discord пользователей
async function handleDiscordUser(discordUser) {
    let user;
    try {
        console.log('[Discord] Поиск пользователя по discord_id:', discordUser.id);
        user = await pool.query(
            'SELECT * FROM users WHERE discord_id = $1',
            [discordUser.id]
        );
        if (user.rows.length === 0) {
            console.log('[Discord] Пользователь не найден, создаём нового:', discordUser.username);
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
        } else {
            console.log('[Discord] Пользователь найден:', user.rows[0].username);
        }
    } catch (dbError) {
        console.error('[Discord] Ошибка работы с БД при Discord авторизации:', dbError);
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
            console.error('[Discord] Ошибка создания пользователя:', insertError);
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
            console.warn('Попытка доступа к /api/settings без авторизации');
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
        res.status(500).json({ error: 'Ошибка сервера', details: error.message });
    }
});

// Discord OAuth2 callback
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    console.log('[Discord] /auth/discord/callback вызван, code:', code);
    if (!code) {
        console.warn('[Discord] Нет кода авторизации в callback!');
        return res.redirect('/?error=no_code');
    }
    try {
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);
        console.log('[Discord] Обмениваем code на access_token...');
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token } = tokenResponse.data;
        console.log('[Discord] Получен access_token:', !!access_token);
        console.log('[Discord] Получаем данные пользователя...');
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const discordUser = userResponse.data;
        console.log('[Discord] Данные пользователя:', discordUser.id, discordUser.username);
        const userData = await handleDiscordUser(discordUser);
        req.session.userId = userData.id;
        req.session.user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar_url,
            registrationDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString() : '',
            discordId: userData.discord_id
        };
        console.log('[Discord] Сессия установлена для userId:', req.session.userId);
        res.redirect('/?discord_success=true');
    } catch (error) {
        console.error('[Discord] OAuth error:', error.response ? error.response.data : error);
        res.redirect('/?error=oauth_failed');
    }
});

// API endpoint для обработки Discord авторизации
app.post('/api/auth/discord', async (req, res) => {
    const { code } = req.body;
    console.log('[Discord] POST /api/auth/discord вызван, code:', code);
    if (!code) {
        console.warn('[Discord] Нет кода авторизации в POST!');
        return res.status(400).json({ error: 'No code provided' });
    }
    try {
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);
        console.log('[Discord] Обмениваем code на access_token...');
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const { access_token } = tokenResponse.data;
        console.log('[Discord] Получен access_token:', !!access_token);
        console.log('[Discord] Получаем данные пользователя...');
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const discordUser = userResponse.data;
        console.log('[Discord] Данные пользователя:', discordUser.id, discordUser.username);
        const userData = await handleDiscordUser(discordUser);
        req.session.userId = userData.id;
        req.session.user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar_url,
            registrationDate: userData.created_at ? new Date(userData.created_at).toLocaleDateString() : '',
            discordId: userData.discord_id
        };
        console.log('[Discord] Сессия установлена для userId:', req.session.userId);
        res.json(req.session.user);
    } catch (error) {
        console.error('[Discord] OAuth error:', error.response ? error.response.data : error);
        res.status(500).json({ error: 'OAuth failed', details: error.response ? error.response.data : error.message });
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
            registrationDate: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
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

// --- DONATE API: ЮMoney integration через axios ---
app.post('/api/donate/create-payment', async (req, res) => {
    try {
        const { orderId, amount, coins, userId, description } = req.body;
        if (!orderId || !amount || !coins || !userId) {
            return res.json({ success: false, error: 'Недостаточно данных' });
        }
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.json({ success: false, error: 'Пользователь не найден' });
        }
        // Формируем запрос к ЮKassa
        const shopId = process.env.YUMONEY_SHOP_ID;
        const secretKey = process.env.YUMONEY_SECRET_KEY;
        const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');
        const paymentData = {
            amount: { value: amount.toString(), currency: 'RUB' },
            confirmation: { type: 'embedded' },
            capture: true,
            description: description,
            metadata: { orderId, userId, coins }
        };
        const idempotenceKey = orderId;
        const response = await axios.post('https://api.yookassa.ru/v3/payments', paymentData, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotenceKey
            }
        });
        const payment = response.data;
        // Сохраняем платеж в БД
        await pool.query(`
            INSERT INTO payments (user_id, order_id, amount, coins, payment_id, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        `, [userId, orderId, amount, coins, payment.id, payment.status]);
        res.json({
            success: true,
            paymentId: payment.id,
            confirmationToken: payment.confirmation.confirmation_token
        });
    } catch (error) {
        console.error('Ошибка создания платежа:', error.response?.data || error);
        res.json({ success: false, error: error.response?.data?.description || 'Внутренняя ошибка сервера' });
    }
});

app.post('/api/donate/success', async (req, res) => {
    try {
        const { orderId, amount, coins, userId, paymentId } = req.body;
        if (!orderId || !amount || !coins || !userId || !paymentId) {
            return res.json({ success: false, error: 'Недостаточно данных' });
        }
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.json({ success: false, error: 'Пользователь не найден' });
        }
        // Проверяем статус платежа в ЮKassa
        const shopId = process.env.YUMONEY_SHOP_ID;
        const secretKey = process.env.YUMONEY_SECRET_KEY;
        const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64');
        const paymentResp = await axios.get(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        const payment = paymentResp.data;
        if (payment.status === 'succeeded') {
            // Проверяем, что донат ещё не был начислен
            const existing = await pool.query('SELECT * FROM donations WHERE order_id = $1', [orderId]);
            if (existing.rows.length > 0) {
                return res.json({ success: false, error: 'Заказ уже обработан' });
            }
            // Начисляем монеты
            const newCoins = (user.rows[0].coins || 0) + coins;
            await pool.query('UPDATE users SET coins = $1 WHERE id = $2', [newCoins, userId]);
            await pool.query(`
                INSERT INTO donations (user_id, order_id, amount, coins, payment_id, created_at)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            `, [userId, orderId, amount, coins, paymentId]);
            await pool.query('UPDATE payments SET status = $1 WHERE payment_id = $2', ['succeeded', paymentId]);
            res.json({ success: true, newBalance: newCoins });
        } else {
            res.json({ success: false, error: 'Платеж не подтвержден' });
        }
    } catch (error) {
        console.error('Ошибка обработки доната:', error.response?.data || error);
        res.json({ success: false, error: error.response?.data?.description || 'Внутренняя ошибка сервера' });
    }
});

app.get('/agreement', (req, res) => {
  res.sendFile(path.join(__dirname, 'agreement.html'));
});

const TWITCH_API_BASE = 'https://api.twitch.tv/helix';
let TWITCH_APP_TOKEN = null;

// Получить app access token для Twitch API
async function getTwitchAppToken() {
    if (TWITCH_APP_TOKEN && TWITCH_APP_TOKEN.expires > Date.now()) {
        return TWITCH_APP_TOKEN.token;
    }
    const resp = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: TWITCH_CLIENT_ID,
            client_secret: TWITCH_CLIENT_SECRET,
            grant_type: 'client_credentials'
        }
    });
    TWITCH_APP_TOKEN = {
        token: resp.data.access_token,
        expires: Date.now() + (resp.data.expires_in - 60) * 1000
    };
    return TWITCH_APP_TOKEN.token;
}

// Получить список подписок и стримов пользователя Twitch
app.get('/api/twitch/subscriptions', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.twitchId) {
            return res.status(401).json({ error: 'Нет Twitch-профиля' });
        }
        const twitchId = req.session.user.twitchId;
        const twitchUsername = req.session.user.twitchUsername;
        const token = await getTwitchAppToken();
        // Получаем список фолловингов (подписок)
        const followsResp = await axios.get(`${TWITCH_API_BASE}/users/follows`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`
            },
            params: {
                from_id: twitchId,
                first: 100
            }
        });
        const follows = followsResp.data.data;
        // Получаем инфу о стримах для всех followings
        const toIds = follows.map(f => f.to_id);
        let liveStreams = [];
        if (toIds.length > 0) {
            // Twitch API ограничивает до 100 id за раз
            const streamsResp = await axios.get(`${TWITCH_API_BASE}/streams`, {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`
                },
                params: { user_id: toIds }
            });
            liveStreams = streamsResp.data.data;
        }
        res.json({
            subscriptions: follows,
            live: liveStreams
        });
    } catch (error) {
        console.error('Ошибка Twitch API:', error.response?.data || error);
        res.status(500).json({ error: 'Ошибка Twitch API', details: error.response?.data || error.message });
    }
});

// Инициализация и запуск сервера
async function startServer() {
    try {
        await initDatabase().catch(error => {
            console.error('Предупреждение: Ошибка инициализации БД:', error.message);
            console.log('Сервер продолжит работу, но некоторые функции могут быть недоступны');
        });
        await ensurePasswordHashColumn();
        await createDefaultAdmin();
        await ensureSessionTable();
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Сервер запущен на http://localhost:${process.env.PORT || 3000}`);
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
