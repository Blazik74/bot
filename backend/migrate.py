import asyncio
import logging
import sys
import os

# Добавляем путь к родительской директории, чтобы импорты работали
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.db import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting database migration...")
    try:
        asyncio.run(init_db())
        logger.info("Database migration successful.")
    except Exception as e:
        logger.error(f"Database migration failed: {e}")
        # Выход с ошибкой, чтобы прервать развертывание на Render
        sys.exit(1) 