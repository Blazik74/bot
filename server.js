const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);
const app = express();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1391384219661500558';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'oGyzFo623gOhMz8ZsDx1yvPF3vjJjtgO';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://arness-community.onrender.com/auth/discord/callback';

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
  console.error('❌ Discord OAuth переменные не заданы! Проверьте .env');
  process.exit(1);
}

const TWITCH_CLIENT_ID = '7pewyshzfymoj5at2odselalrjj1gm';
const TWITCH_CLIENT_SECRET = '8c4uuj3b4eq2v9dm6pnnowd68hgekf';
const TWITCH_REDIRECT_URI = 'https://arness-community.onrender.com/auth/twitch/callback';

const pool = new Pool({
    connectionString: 'postgresql://pixel_ai_backend_user:oGyzFo623gOhMz8ZsDx1yvPF3vjJjtgO@dpg-d1ehca6uk2gs73anldu0-a/pixel_ai_backend',
    ssl: {
        rejectUnauthorized: false
    }
});

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
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

async function initDatabase() {
    try {
        const client = await pool.connect();
        
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

        const columnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'discord_id'
        `);

        if (columnCheck.rows.length === 0) {
            console.log('Добавляем колонку discord_id...');
            await client.query(`
                ALTER TABLE users 
                ADD COLUMN discord_id VARCHAR(255) UNIQUE
            `);
        }

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

        const settingsCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'settings'
        `);
        if (settingsCol.rows.length === 0) {
            await client.query(`ALTER TABLE users ADD COLUMN settings JSONB DEFAULT '{}'`);
        }

        const twitchIdCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'twitch_id'
        `);
        if (twitchIdCol.rows.length === 0) {
            await client.query(`ALTER TABLE users ADD COLUMN twitch_id VARCHAR(255)`);
        }
        const twitchUsernameCol = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'twitch_username'
        `);
        if (twitchUsernameCol.rows.length === 0) {
            await client.query(`ALTER TABLE users ADD COLUMN twitch_username VARCHAR(255)`);
        }

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
    }
}

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
            DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
                    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
                END IF;
            END $$;
        `);
        await client.query(`
            CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
        `);
        client.release();
        console.log('Таблица session для сессий готова (через ensureSessionTable)');
    } catch (err) {
        console.error('Ошибка создания таблицы session (через ensureSessionTable):', err);
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
        }

        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }
        const existingUsername = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );
        if (existingUsername.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким ником уже существует' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            `INSERT INTO users (username, name, email, password_hash, avatar_url, role) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, avatar_url, created_at`,
            [username, username, email, passwordHash, `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`, 'user']
        );
        const user = newUser.rows[0];
        
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

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Ник и пароль обязательны' });
        }

        const userResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Неверный ник или пароль' });
        }

        const user = userResult.rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Неверный ник или пароль' });
        }

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

app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка выхода' });
        }
        res.json({ success: true });
    });
});

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
            req.session.user = userObj;
            res.json({ authenticated: true, user: userObj });
        } catch (e) {
            return res.json({ authenticated: false });
        }
    } else {
        res.json({ authenticated: false });
    }
});

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

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Не авторизован' });
    }
    next();
}

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

app.get('/auth/twitch', (req, res) => {
    const scope = 'user:read:email user:read:follows';
    const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(TWITCH_REDIRECT_URI)}&response_type=code&scope=${scope}`;
    res.redirect(twitchAuthUrl);
});

app.get('/auth/twitch/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.redirect('/accountPage?error=twitch_no_code');
    try {
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
        const userResp = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Client-Id': TWITCH_CLIENT_ID
            }
        });
        const twitchUser = userResp.data.data[0];
        if (req.session.userId) {
            await pool.query(
                'UPDATE users SET twitch_id = $1, twitch_username = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
                [twitchUser.id, twitchUser.login, req.session.userId]
            );
        }
        if (req.session.user) {
            req.session.user.twitchId = twitchUser.id;
            req.session.user.twitchUsername = twitchUser.login;
        }
        req.session.twitchUserAccessToken = access_token;
        res.redirect('/?twitch_success=true');
    } catch (error) {
        console.error('Twitch OAuth error:', error);
        res.redirect('/?error=twitch_oauth_failed');
    }
});

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID || 'demo_shop_id'; // <-- ВСТАВЬТЕ shopId сюда
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY || 'demo_secret_key'; // <-- ВСТАВЬТЕ secretKey сюда

app.post('/api/donate/create-payment', async (req, res) => {
    if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY || YOOKASSA_SHOP_ID === 'demo_shop_id') {
        return res.json({ success: false, error: 'ЮKassa не настроена. Ожидается shopId и secretKey.' });
    }
    try {
        const { orderId, amount, coins, userId, description } = req.body;
        if (!orderId || !amount || !coins || !userId) {
            return res.json({ success: false, error: 'Недостаточно данных' });
        }
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.json({ success: false, error: 'Пользователь не найден' });
        }
        const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');
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
        const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');
        const paymentResp = await axios.get(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        });
        const payment = paymentResp.data;
        if (payment.status === 'succeeded') {
            const existing = await pool.query('SELECT * FROM donations WHERE order_id = $1', [orderId]);
            if (existing.rows.length > 0) {
                return res.json({ success: false, error: 'Заказ уже обработан' });
            }
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

app.get('/api/twitch/subscriptions', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.twitchId) {
            return res.status(401).json({ error: 'Нет Twitch-профиля' });
        }
        const userAccessToken = req.session.twitchUserAccessToken;
        if (!userAccessToken) {
            return res.status(401).json({ error: 'Нет Twitch access token. Переподключите Twitch.' });
        }
        const twitchId = req.session.user.twitchId;
        let follows = [];
        let liveStreams = [];
        const followsResp = await axios.get(`${TWITCH_API_BASE}/channels/followed`, {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${userAccessToken}`
            },
            params: {
                user_id: twitchId,
                first: 100
            }
        });
        follows = followsResp.data.data.map(f => ({
            to_id: f.broadcaster_id,
            to_name: f.broadcaster_name,
            to_login: f.broadcaster_login,
            followed_at: f.followed_at
        }));
        const toIds = follows.map(f => f.to_id);
        if (toIds.length > 0) {
            const streamsResp = await axios.get(`${TWITCH_API_BASE}/streams`, {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${userAccessToken}`
                },
                params: { user_id: toIds }
            });
            liveStreams = streamsResp.data.data;
        }
        let usersInfo = [];
        if (toIds.length > 0) {
            const usersResp = await axios.get(`${TWITCH_API_BASE}/users`, {
                headers: {
                    'Client-ID': TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${userAccessToken}`
                },
                params: { id: toIds }
            });
            usersInfo = usersResp.data.data;
        }
        const userInfoMap = {};
        usersInfo.forEach(u => { userInfoMap[u.id] = u; });
        let subscriptions = follows.map(f => {
            const user = userInfoMap[f.to_id];
            return {
                to_id: f.to_id,
                to_name: f.to_name,
                to_login: f.to_login,
                followed_at: f.followed_at,
                avatar_url: user ? user.profile_image_url : null,
                twitch_url: user ? `https://twitch.tv/${user.login}` : null
            };
        });
        const liveIds = new Set(liveStreams.map(s => s.user_id));
        subscriptions = [
            ...subscriptions.filter(s => liveIds.has(s.to_id)),
            ...subscriptions.filter(s => !liveIds.has(s.to_id))
        ];
        res.json({
            subscriptions,
            live: liveStreams
        });
    } catch (error) {
        console.error('Ошибка Twitch API:', error.response?.data || error);
        res.status(500).json({ error: 'Ошибка Twitch API', details: error.response?.data || error.message });
    }
});

app.post('/api/twitch/logout', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Не авторизован' });
        }
        await pool.query('UPDATE users SET twitch_id = NULL, twitch_username = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [req.session.userId]);
        if (req.session.user) {
            delete req.session.user.twitchId;
            delete req.session.user.twitchUsername;
        }
        delete req.session.twitchUserAccessToken;
        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка отвязки Twitch:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

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

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    pool.end();
    process.exit(0);
});

startServer(); 