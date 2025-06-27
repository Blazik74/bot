import asyncio
import os
import logging

# Импортируем необходимые компоненты из ваших модулей
from .bot import setup_bot, TELEGRAM_BOT_TOKEN
from .db import init_db, create_default_tariffs, AsyncSessionLocal

# Настраиваем логирование
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

async def main():
    """
    Основная асинхронная функция для выполнения инициализации.
    """
    logger.info("Starting initialization...")

    # 1. Инициализация базы данных (создание таблиц и тарифов)
    try:
        await init_db()
        async with AsyncSessionLocal() as session:
            await create_default_tariffs(session)
        logger.info("Database initialization completed successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}", exc_info=True)
        # В случае ошибки БД, возможно, нет смысла продолжать
        return

    # 2. Установка вебхука для Telegram-бота
    # Убедимся, что токен и URL для вебхука заданы
    if not TELEGRAM_BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN is not set. Cannot set webhook.")
        return

    webhook_url = os.environ.get("WEBHOOK_URL")
    if not webhook_url:
        # Формируем правильный URL для webhook
        backend_url = os.environ.get("BACKEND_URL", "https://back-guqa.onrender.com")
        webhook_url = f"{backend_url}/telegram/{TELEGRAM_BOT_TOKEN}"
        logger.warning(f"WEBHOOK_URL не задан, использую {webhook_url}")
    logger.warning(f"DEBUG: webhook_url = {webhook_url}")

    try:
        # Создаем экземпляр бота, но не запускаем его
        bot_app = setup_bot(webhook_mode=True)
        
        # Устанавливаем вебхук
        logger.info(f"Setting webhook to: {webhook_url}")
        await bot_app.bot.set_webhook(url=webhook_url, allowed_updates=bot_app.update_types)
        logger.info("Webhook has been set successfully!")

        # Проверим информацию о вебхуке
        webhook_info = await bot_app.bot.get_webhook_info()
        logger.info(f"Current webhook info: {webhook_info}")

    except Exception as e:
        logger.error(f"Failed to set webhook: {e}", exc_info=True)

if __name__ == "__main__":
    asyncio.run(main()) 
