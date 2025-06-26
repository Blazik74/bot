from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
import logging
from datetime import datetime
from .db import AsyncSessionLocal, User, Campaign
from sqlalchemy.future import select

# Здесь будут импорты ваших сервисов
# from fb_ads import FacebookAdsService
# from ai import AIService
# from telegram_notify import TelegramNotifyService
# from users import UserService

logger = logging.getLogger(__name__)

class AutopilotService:
    def __init__(self):
        # Используем отдельную, синхронную БД для задач планировщика
        jobstores = {
            'default': SQLAlchemyJobStore(url="sqlite:///jobs.sqlite")
        }
        self.scheduler = AsyncIOScheduler(jobstores=jobstores)

    def start(self):
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("Планировщик автопилота запущен.")
            # Добавляем тестовую задачу как статический метод
            self.scheduler.add_job(check_campaigns_status_static, 'interval', hours=1, id='check_campaigns', replace_existing=True)

    def stop(self):
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Планировщик автопилота остановлен.")

    @staticmethod
    async def check_campaigns_status():
        """
        Пример фоновой задачи: проверяет статус активных кампаний.
        """
        logger.info("Автопилот: Проверка статуса кампаний...")
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Campaign).where(Campaign.status == 'ACTIVE')
            )
            active_campaigns = result.scalars().all()
            
            if not active_campaigns:
                logger.info("Автопилот: Активных кампаний для проверки не найдено.")
                return

            for campaign in active_campaigns:
                logger.info(f"Автопилот: Кампания '{campaign.name}' (ID: {campaign.facebook_campaign_id}) активна.")
                # Здесь в будущем будет логика анализа и принятия решений

    @staticmethod
    async def optimization_cycle(user_id: int):
        """
        Основной цикл фоновой оптимизации для одного пользователя.
        """
        logger.info(f"Запуск цикла оптимизации для пользователя {user_id} в {datetime.now()}")
        
        # 1. Проверить, активен ли пользователь и его подписка
        # user_service = UserService()
        # can_use_autopilot = await user_service.check_user_permissions(user_id, "autopilot")
        # if not can_use_autopilot:
        #     logger.warning(f"Автопилот отключен для пользователя {user_id} из-за ограничений тарифа.")
        #     await self.stop_for_user(user_id)
        #     return

        # 2. Получить активные кампании из Facebook
        # fb_service = FacebookAdsService()
        # campaigns = await fb_service.get_campaigns(user_id, status="ACTIVE")

        # 3. Для каждой кампании получить рекомендации от ИИ
        # ai_service = AIService()
        # for campaign in campaigns:
        #     suggestions = await ai_service.get_suggestions(user_id, campaign)
            
        #     # 4. Применить безопасные действия (например, остановить неэффективную кампанию)
        #     await self.apply_suggestions(user_id, campaign, suggestions)

        #     # 5. Отправить уведомление пользователю
        #     telegram_service = TelegramNotifyService()
        #     await telegram_service.send_autopilot_report(user_id, report_data)
        
        # 6. Залогировать все действия
        # ...
        
        logger.info(f"Цикл оптимизации для пользователя {user_id} завершен.")

    @staticmethod
    async def apply_suggestions(user_id, campaign, suggestions):
        """
        Применяет рекомендации ИИ.
        Пока что просто логика-заглушка.
        """
        logger.info(f"Применение рекомендаций для кампании {campaign['id']} пользователя {user_id}")
        # Здесь будет логика, которая решает, какие действия предпринять
        # Например, если CTR < 0.5%, остановить кампанию.
        pass

    async def start_for_user(self, user_id: int):
        """
        Запускает фоновую задачу автопилота для пользователя.
        Задача будет выполняться каждые 4 часа.
        """
        job_id = f"autopilot_user_{user_id}"
        if self.scheduler.get_job(job_id):
            logger.warning(f"Задача {job_id} уже существует.")
            return

        self.scheduler.add_job(
            optimization_cycle_static,
            'interval',
            hours=4,
            id=job_id,
            args=[user_id],
            replace_existing=True
        )
        logger.info(f"Автопилот запущен для пользователя {user_id}. Job ID: {job_id}")

    async def stop_for_user(self, user_id: int):
        """
        Останавливает задачу автопилота для пользователя.
        """
        job_id = f"autopilot_user_{user_id}"
        if self.scheduler.get_job(job_id):
            self.scheduler.remove_job(job_id)
            logger.info(f"Автопилот остановлен для пользователя {user_id}. Job ID: {job_id}")

    async def get_status(self, user_id: int) -> dict:
        """
        Возвращает статус автопилота для пользователя.
        """
        job_id = f"autopilot_user_{user_id}"
        job = self.scheduler.get_job(job_id)
        if job:
            return {
                "is_active": True,
                "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None
            }
        else:
            return {"is_active": False}

# Статическая функция для планировщика
async def check_campaigns_status_static():
    """
    Статическая версия функции для APScheduler.
    """
    logger.info("Автопилот: Проверка статуса кампаний...")
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Campaign).where(Campaign.status == 'ACTIVE')
        )
        active_campaigns = result.scalars().all()
        
        if not active_campaigns:
            logger.info("Автопилот: Активных кампаний для проверки не найдено.")
            return

        for campaign in active_campaigns:
            logger.info(f"Автопилот: Кампания '{campaign.name}' (ID: {campaign.facebook_campaign_id}) активна.")
            # Здесь в будущем будет логика анализа и принятия решений 

# Статическая функция для планировщика пользовательских задач
async def optimization_cycle_static(user_id: int):
    """
    Статическая версия функции optimization_cycle для APScheduler.
    """
    logger.info(f"Запуск цикла оптимизации для пользователя {user_id} в {datetime.now()}")
    
    # Здесь будет та же логика, что и в методе класса
    # ...
    
    logger.info(f"Цикл оптимизации для пользователя {user_id} завершен.") 