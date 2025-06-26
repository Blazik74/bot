import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, ConversationHandler, ApplicationBuilder, CallbackQueryHandler, PicklePersistence
from datetime import datetime, timedelta
import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func

# Импортируем наши сервисы и модели с использованием относительного пути
from .db import AsyncSessionLocal, User, Tariff, init_db
from .users import UserService

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# --- Настройки ---
# ВАЖНО: Укажите username суперадминистраторов в переменных окружения на Render.
#
# Как это сделать:
# 1. Зайдите в ваш сервис на Render.
# 2. Перейдите во вкладку "Environment".
# 3. В "Environment Variables" добавьте новую переменную:
#    - Key: SUPERADMIN_USERNAMES
#    - Value: ваш_username1,ваш_username2 (через запятую, БЕЗ @ и пробелов)
#
# Пример Value: blazik1,isonim
SUPERADMIN_USERNAMES = [
    username.strip() 
    for username in os.environ.get("SUPERADMIN_USERNAMES", "").split(',') 
    if username.strip()
]
if not SUPERADMIN_USERNAMES:
    logger.warning("!!! SUPERADMIN_USERNAMES is not set in environment variables. Admin features will not work correctly.")

TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")

# --- Состояния для ConversationHandler ---
(
    CHOOSING_COMMAND,
    GET_USERNAME_FOR_GRANT, GET_DURATION_FOR_GRANT, GET_TARIFF_FOR_GRANT,
    GET_USERNAME_FOR_REVOKE,
    GET_USERNAME_FOR_GRANT_ADMIN,
    GET_USERNAME_FOR_REVOKE_ADMIN,
    GET_USERNAME_FOR_INFO
) = range(8)

# --- Декоратор для проверки прав администратора/суперадминистратора ---
def admin_required(func):
    """Декоратор для проверки прав администратора/суперадминистратора."""
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        user = update.effective_user
        if not user:
            return
        
        async with AsyncSessionLocal() as session:
            db_user = await _find_user_by_telegram_id(str(user.id), session)
            
            is_superadmin = user.username in SUPERADMIN_USERNAMES

            if is_superadmin:
                if not db_user:
                    logger.info(f"Superadmin {user.username} not found in DB, creating new entry.")
                    db_user = User(
                        telegram_id=str(user.id),
                        username=user.username,
                        name=user.full_name,
                        role='superadmin',
                        tariff_id=3, # Тариф "Компания"
                        is_active=True,
                        access_expires_at=None
                    )
                    session.add(db_user)
                    await session.commit()
                elif db_user.role != 'superadmin' or db_user.tariff_id != 3:
                    logger.info(f"User {user.username} found in DB, updating role to superadmin and granting access.")
                    db_user.role = 'superadmin'
                    db_user.tariff_id = 3
                    db_user.access_expires_at = None
                
                return await func(update, context, *args, **kwargs)

            # Проверка на админа в БД
            if db_user and db_user.role in ["admin", "superadmin"]:
                return await func(update, context, *args, **kwargs)

        # Если ни одно из условий не выполнено
        await update.message.reply_text("У вас нет прав для выполнения этой команды.")
    return wrapper

async def _find_user_by_telegram_id(telegram_id: str, session: AsyncSession) -> User | None:
    result = await session.execute(
        select(User).where(User.telegram_id == telegram_id)
    )
    return result.scalar_one_or_none()

async def _find_user_by_username(username: str, session: AsyncSession) -> User:
    """
    Находит пользователя в БД по username. Username может быть с @ или без.
    Поиск нечувствителен к регистру.
    Если пользователь не найден - создает нового "пустого" пользователя.
    """
    clean_username = username.lstrip('@')
    
    # Сначала ищем существующего пользователя
    result = await session.execute(
        select(User).where(func.lower(User.username) == func.lower(clean_username))
    )
    user = result.scalar_one_or_none()
    
    # Если не нашли, создаем нового
    if user is None:
        logger.info(f"User '{clean_username}' not found, creating a placeholder user.")
        user = User(
            username=clean_username,
            name=clean_username,  # Временно используем username как имя
            role="user",
            tariff_id=1,
            # telegram_id будет добавлен, когда пользователь сам запустит /start
        )
        session.add(user)
        # Важно: не делаем commit здесь, т.к. вызывающая функция сделает это
        # после применения изменений (например, выдачи тарифа).
        # Но нужно получить user.id, для этого делаем flush.
        await session.flush()
        await session.refresh(user)

    return user

# --- Обработчики команд ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    username = update.effective_user.username
    full_name = update.effective_user.full_name
    
    async with AsyncSessionLocal() as session:
        user = (await session.execute(select(User).where(User.telegram_id == user_id))).scalar_one_or_none()

        if not user:
            logger.info(f"Новый пользователь: {username} ({user_id})")
            user = User(
                telegram_id=user_id,
                username=username,
                name=full_name,
                role="user",
                tariff_id=1,
            )
            session.add(user)
        else:
            # Обновляем данные, если они изменились
            user.username = username
            user.name = full_name

        # Проверяем и обновляем статус суперадмина при каждом /start
        # Эта логика теперь гарантирует, что права суперадмина всегда будут на месте
        if username in SUPERADMIN_USERNAMES:
            if user.role != 'superadmin' or user.tariff_id != 3:
                logger.info(f"Updating user {username} to superadmin.")
                user.role = "superadmin"
                user.tariff_id = 3  # Тариф "Компания"
                user.access_expires_at = None
        
        await session.commit()
        await session.refresh(user) # Обновляем объект user из БД
            
    # Формируем приветственное сообщение
    welcome_text = """
🤖 <b>ИИ Таргетолог</b> — ваш персональный помощник для управления и оптимизации рекламных кампаний в Facebook Ads!

• Автоматизация рутинных задач
• Генерация креативов
• Рекомендации по улучшению
• Интеграция с OpenAI и Facebook

Запустите мини-приложение для начала работы:
"""
    
    # Создаем кнопку для Web App
    frontend_url = os.environ.get("FRONTEND_URL", "https://tg-miniapp-7li9.onrender.com") # Заглушка, если URL не найден
    keyboard = [[InlineKeyboardButton("🚀 Открыть мини-приложение", web_app={"url": frontend_url})]]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Отправляем единое сообщение с текстом и кнопкой
    await update.message.reply_text(
        text=welcome_text.strip(),
        reply_markup=reply_markup,
        parse_mode='HTML'
    )


@admin_required
async def help_ap(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
    <b>Команды Админ-панели:</b>

/admin - Показать интерактивное меню для управления пользователями.
/help_ap - Показать это сообщение.
    """
    await update.message.reply_text(help_text, parse_mode='HTML')


async def find_user_by_username(username: str, session: AsyncSession):
    # В Telegram нет прямого способа найти юзера по username, если он не писал боту.
    # Этот метод сработает, только если пользователь уже запускал /start
    result = await session.execute(
        select(User).where(User.name.contains(username)) # Ищем по имени, т.к. username не хранится
    )
    # Это не надежно. В идеале, нужно просить юзера переслать сообщение.
    # Пока что оставим так, но это нужно будет улучшить.
    # Давайте будем искать по telegram_id, который администратор должен откуда-то знать
    # Или по имени, которое может быть не уникальным. 
    # Лучше всего - попросить пользователя, которому даем доступ, сначала запустить бота.
    return None # Заглушка, нужно реализовать поиск

@admin_required
async def grant_access(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Выдает пользователю доступ к определенному тарифу на указанный срок.
    Формат: /grant_access <@username> <срок> <название_тарифа>
    Пример: /grant_access @testuser 30d Фрилансер
    """
    if not context.args or len(context.args) < 3:
        await update.message.reply_text(
            "Неверный формат. Используйте:\n"
            "/grant_access <@username> <срок> <тариф>\n"
            "Пример: /grant_access @user 30d Компания"
        )
        return

    username = context.args[0]
    period_str = context.args[1]
    # Объединяем оставшиеся аргументы в название тарифа
    tariff_name_input = " ".join(context.args[2:])

    await grant_access_logic(update.message, username, period_str, tariff_name_input)


@admin_required
async def revoke_access(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Отозвать доступ и вернуть бесплатный тариф. Формат: /revoke_access <@username>"""
    if not context.args:
        await update.message.reply_text("Укажите username пользователя.")
        return
    username = context.args[0]
    await revoke_access_logic(update.message, username)


@admin_required
async def grant_admin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Назначить пользователя администратором. Формат: /grant_admin <@username>"""
    if not context.args:
        await update.message.reply_text("Укажите username пользователя.")
        return
    username = context.args[0]
    await grant_admin_logic(update.message, username)


@admin_required
async def revoke_admin(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Снять права администратора. Формат: /revoke_admin <@username>"""
    if not context.args:
        await update.message.reply_text("Укажите username пользователя.")
        return
    username = context.args[0]
    await revoke_admin_logic(update.message, username)


@admin_required
async def user_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показать информацию о пользователе. Формат: /user_info <@username>"""
    if not context.args:
        await update.message.reply_text("Укажите username пользователя.")
        return
    username = context.args[0]
    await user_info_logic(update.message, username)


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Завершает диалог."""
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text="Действие отменено.")
    return ConversationHandler.END


# --- Переписанные админ-команды ---

@admin_required
async def start_conversation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Начинает диалог и спрашивает, что админ хочет сделать."""
    text = "Выберите действие:"
    keyboard = [
        [InlineKeyboardButton("Выдать доступ", callback_data=str(GET_USERNAME_FOR_GRANT))],
        [InlineKeyboardButton("Отозвать доступ", callback_data=str(GET_USERNAME_FOR_REVOKE))],
        [InlineKeyboardButton("Назначить админа", callback_data=str(GET_USERNAME_FOR_GRANT_ADMIN))],
        [InlineKeyboardButton("Снять права админа", callback_data=str(GET_USERNAME_FOR_REVOKE_ADMIN))],
        [InlineKeyboardButton("Информация о юзере", callback_data=str(GET_USERNAME_FOR_INFO))],
        [InlineKeyboardButton("Отмена", callback_data='cancel')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(text, reply_markup=reply_markup)
    return CHOOSING_COMMAND

async def ask_for_username(update: Update, context: ContextTypes.DEFAULT_TYPE, next_state: int) -> int:
    """Общая функция для запроса username."""
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text="Введите username пользователя (можно с @):")
    return next_state
    
# ... (здесь будут функции для каждого шага диалога)

# --- Реализация шагов диалога ---

async def received_username_for_grant(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили username, запрашиваем срок."""
    username = update.message.text
    context.user_data['username'] = username
    await update.message.reply_text("Введите срок доступа (например: 7d, 1m, 1y):")
    return GET_DURATION_FOR_GRANT

async def received_duration_for_grant(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили срок, запрашиваем тариф."""
    duration = update.message.text
    context.user_data['duration'] = duration
    keyboard = [
        [InlineKeyboardButton("Фрилансер", callback_data="фрилансер")],
        [InlineKeyboardButton("Компания", callback_data="компания")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("Выберите тариф:", reply_markup=reply_markup)
    return GET_TARIFF_FOR_GRANT

async def received_tariff_for_grant(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили тариф, выдаем доступ."""
    query = update.callback_query
    await query.answer()
    tariff_name = query.data
    
    username = context.user_data['username']
    duration = context.user_data['duration']

    # Вызываем старую, но исправленную логику
    await grant_access_logic(query.message, username, duration, tariff_name)
    context.user_data.clear()
    return ConversationHandler.END
    
# --- Обработчики для остальных веток диалога ---

async def received_username_for_revoke(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили username, отзываем доступ."""
    username = update.message.text
    await revoke_access_logic(update.message, username)
    context.user_data.clear()
    return ConversationHandler.END

async def received_username_for_grant_admin(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили username, назначаем админом."""
    username = update.message.text
    await grant_admin_logic(update.message, username)
    context.user_data.clear()
    return ConversationHandler.END

async def received_username_for_revoke_admin(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили username, снимаем права админа."""
    username = update.message.text
    await revoke_admin_logic(update.message, username)
    context.user_data.clear()
    return ConversationHandler.END

async def received_username_for_info(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Получили username, показываем информацию."""
    username = update.message.text
    await user_info_logic(update.message, username)
    context.user_data.clear()
    return ConversationHandler.END


# --- Логика, вынесенная из старых команд ---
async def grant_access_logic(message, username, period_str, tariff_name_input):
    """Универсальная логика для выдачи доступа."""
    async with AsyncSessionLocal() as session:
        user = await _find_user_by_username(username, session)
        
        try:
            # Преобразуем "1m", "7d", "1y" в timedelta
            num = int(re.search(r'\d+', period_str).group())
            unit = re.search(r'[a-zA-Z]+', period_str).group().lower()
            if unit == 'd':
                delta = timedelta(days=num)
            elif unit == 'm':
                delta = timedelta(days=num * 30)
            elif unit == 'y':
                delta = timedelta(days=num * 365)
            else:
                raise ValueError("Неверная единица времени")
            expires_at = datetime.utcnow() + delta
        except (AttributeError, ValueError) as e:
            await message.reply_text(f"Ошибка в формате срока: '{period_str}'. Используйте 'd' для дней, 'm' для месяцев, 'y' для лет (например: 7d, 1m, 1y).")
            return

        # Получаем все тарифы из БД
        all_tariffs_result = await session.execute(select(Tariff))
        all_tariffs = all_tariffs_result.scalars().all()

        # Ищем нужный тариф в коде, а не в БД, для регистронезависимости
        target_tariff = None
        for t in all_tariffs:
            if t.name.lower() == tariff_name_input.lower():
                target_tariff = t
                break

        if not target_tariff:
            tariff_names = [t.name for t in all_tariffs if t.price > 0]
            await message.reply_text(f"Тариф '{tariff_name_input}' не найден. Доступные тарифы: {', '.join(tariff_names)}.")
            return

        user.tariff_id = target_tariff.id
        user.access_expires_at = expires_at
        user.is_active = True
        if user.role not in ("admin", "superadmin"):
            user.role = "user"
        await session.commit()
        
        expires_str = expires_at.strftime('%Y-%m-%d %H:%M')
        await message.reply_text(f"Пользователю {username} успешно выдан тариф '{target_tariff.name}' до {expires_str} UTC.")

async def revoke_access_logic(message, username):
    """Универсальная логика для отзыва доступа."""
    async with AsyncSessionLocal() as session:
        user = await _find_user_by_username(username, session)
        
        # Проверка if not user больше не нужна, но добавим сообщение, если юзер был создан только что
        # и у него и так нет доступа. Хотя для отзыва это не так важно.

        # Сбрасываем на бесплатный тариф
        user.tariff_id = 1
        user.access_expires_at = None
        user.is_active = True
        await session.commit()
        await message.reply_text(f"Доступ для пользователя {username} был отозван. Установлен тариф 'Бесплатный'.")

async def revoke_admin_logic(message, username):
    # Логика отзыва прав админа
    async with AsyncSessionLocal() as session:
        user = await _find_user_by_username(username, session)
        
        user.role = "user"
        user.tariff_id = 1  # Возвращаем на бесплатный тариф
        user.access_expires_at = None
        user.is_active = True
        await session.commit()
        await message.reply_text(f"Права администратора для пользователя {username} были отозваны.")

async def user_info_logic(message, username):
    # Логика получения информации о пользователе
    async with AsyncSessionLocal() as session:
        user = await _find_user_by_username(username, session)
        
        tariff_result = await session.execute(select(Tariff).where(Tariff.id == user.tariff_id))
        tariff = tariff_result.scalar_one_or_none()
        tariff_name = tariff.name if tariff else "Неизвестный"
        
        expires_at = user.access_expires_at.strftime('%Y-%m-%d %H:%M') if user.access_expires_at else "Нет"

        info_text = (
            f"<b>Информация о пользователе {user.username or user.name}:</b>\n\n"
            f"<b>ID:</b> <code>{user.telegram_id}</code>\n"
            f"<b>Роль:</b> {user.role}\n"
            f"<b>Тариф:</b> {tariff_name}\n"
            f"<b>Доступ до:</b> {expires_at}"
        )
        await message.reply_text(info_text, parse_mode='HTML')

async def grant_admin_logic(message, username):
    # Логика назначения админа
    async with AsyncSessionLocal() as session:
        user = await _find_user_by_username(username, session)
        
        user.role = "admin"
        user.tariff_id = 3  # Тариф "Компания"
        user.access_expires_at = None  # Бессрочный доступ для админов
        user.is_active = True
        await session.commit()
        await message.reply_text(f"Пользователь {username} назначен администратором с тарифом 'Компания'.")

# --- Conversation Handler ---
conv_handler = ConversationHandler(
    entry_points=[CommandHandler("admin", start_conversation)],
    states={
        CHOOSING_COMMAND: [
            CallbackQueryHandler(lambda u,c: ask_for_username(u,c,GET_USERNAME_FOR_GRANT), pattern='^' + str(GET_USERNAME_FOR_GRANT) + '$'),
            CallbackQueryHandler(lambda u,c: ask_for_username(u,c,GET_USERNAME_FOR_REVOKE), pattern='^' + str(GET_USERNAME_FOR_REVOKE) + '$'),
            CallbackQueryHandler(lambda u,c: ask_for_username(u,c,GET_USERNAME_FOR_GRANT_ADMIN), pattern='^' + str(GET_USERNAME_FOR_GRANT_ADMIN) + '$'),
            CallbackQueryHandler(lambda u,c: ask_for_username(u,c,GET_USERNAME_FOR_REVOKE_ADMIN), pattern='^' + str(GET_USERNAME_FOR_REVOKE_ADMIN) + '$'),
            CallbackQueryHandler(lambda u,c: ask_for_username(u,c,GET_USERNAME_FOR_INFO), pattern='^' + str(GET_USERNAME_FOR_INFO) + '$'),
            CallbackQueryHandler(cancel, pattern='^cancel$'),
        ],
        GET_USERNAME_FOR_GRANT: [MessageHandler(filters.TEXT & ~filters.COMMAND, received_username_for_grant)],
        GET_DURATION_FOR_GRANT: [MessageHandler(filters.TEXT & ~filters.COMMAND, received_duration_for_grant)],
        GET_TARIFF_FOR_GRANT: [CallbackQueryHandler(received_tariff_for_grant)],
        GET_USERNAME_FOR_REVOKE: [MessageHandler(filters.TEXT & ~filters.COMMAND, received_username_for_revoke)],
        GET_USERNAME_FOR_GRANT_ADMIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, received_username_for_grant_admin)],
        GET_USERNAME_FOR_REVOKE_ADMIN: [MessageHandler(filters.TEXT & ~filters.COMMAND, received_username_for_revoke_admin)],
        GET_USERNAME_FOR_INFO: [MessageHandler(filters.TEXT & ~filters.COMMAND, received_username_for_info)],
    },
    fallbacks=[CommandHandler("cancel", cancel)],
    persistent=True,
    name="admin_conversation_handler",
    per_message=False
)

def setup_bot(webhook_mode: bool = False) -> Application:
    """
    Создает и настраивает экземпляр бота.
    :param webhook_mode: Если True, бот настраивается для работы через вебхуки, 
                         иначе - в режиме polling.
    """
    # Используем PicklePersistence для сохранения состояний диалога между перезапусками
    persistence = PicklePersistence(filepath="bot_persistence")

    app_builder = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).persistence(persistence)

    # В режиме вебхука отключаем локальный опрос обновлений, чтобы избежать конфликтов
    if webhook_mode:
        app_builder.updater(None)

    app = app_builder.build()

    # Добавляем обработчики
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help_ap", help_ap))
    # Добавляем ConversationHandler для админских команд
    app.add_handler(conv_handler)
    # Удаляем старые отдельные команды, так как они теперь внутри /admin
    # app.add_handler(CommandHandler("grant_access", grant_access))
    # app.add_handler(CommandHandler("revoke_access", revoke_access))
    # app.add_handler(CommandHandler("grant_admin", grant_admin))
    # app.add_handler(CommandHandler("revoke_admin", revoke_admin))
    # app.add_handler(CommandHandler("user_info", user_info))
    
    # Сохраняем типы обновлений, на которые бот будет реагировать (для set_webhook)
    app.update_types = ['message', 'callback_query']

    return app


async def run_bot_polling():
    logger.info("Setting up and running bot polling...")
    try:
        application = setup_bot()
        # run_polling() - это блокирующий вызов.
        # Он будет работать, пока процесс не будет остановлен.
        application.run_polling()
    except ValueError as e:
        logger.error(e) # Логируем ошибку, если токен не найден
    except Exception as e:
        logger.critical(f"An unexpected error occurred in bot main function: {e}", exc_info=True)


if __name__ == "__main__":
    main()
