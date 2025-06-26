import asyncio
import logging

from backend.autopilot import AutopilotService
from backend.utils import setup_logging

# Настраиваем логирование для воркера
setup_logging()
logger = logging.getLogger(__name__)

async def main():
    """
    Главная асинхронная функция для запуска сервиса автопилота.
    """
    logger.info("Starting Autopilot Scheduler worker...")

    autopilot_service = AutopilotService()
    autopilot_service.start()
    
    logger.info("Autopilot Scheduler has started.")
    
    # Бесконечно ждем, чтобы процесс не завершился
    await asyncio.Event().wait()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Autopilot Scheduler worker terminated.") 