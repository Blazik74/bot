from telegram import Bot
import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class TelegramNotifyService:
    def __init__(self):
        self.bot_token = os.environ.get("TELEGRAM_BOT_TOKEN")
        if not self.bot_token:
            logger.warning("TELEGRAM_BOT_TOKEN не найден в переменных окружения.")
            self.bot = None
        else:
            self.bot = Bot(token=self.bot_token)
    
    async def send_message(self, chat_id: str, text: str):
        """
        Отправка простого текстового сообщения пользователю.
        """
        if not self.bot:
            logger.error("Невозможно отправить сообщение: токен бота не настроен.")
            return

        try:
            await self.bot.send_message(chat_id=chat_id, text=text, parse_mode='HTML')
            logger.info(f"Сообщение успешно отправлено в чат {chat_id}")
        except Exception as e:
            logger.error(f"Ошибка при отправке сообщения в чат {chat_id}: {e}")
    
    async def send_welcome_message(self, user: Dict[str, Any]):
        """
        Отправка приветственного сообщения новому пользователю.
        """
        telegram_id = user.get("telegram_id")
        if telegram_id:
            message = f"<b>Добро пожаловать, {user.get('name', '')}!</b>\n\n"
            message += "Ваш AI Marketing Assistant готов к работе. Подключите свой Facebook аккаунт, чтобы начать."
            await self.send_message(telegram_id, message)

    async def send_autopilot_report(self, user_id: int, report_data: Dict[str, Any]):
        """
        Отправка отчета о работе автопилота.
        """
        # Здесь нужно будет получить telegram_id по user_id из базы
        # telegram_id = ...
        telegram_id = "ЗАГЛУШКА_TELEGRAM_ID"
        
        message = "<b>Отчет автопилота</b>\n\n"
        message += f"Проанализировано кампаний: {report_data.get('analyzed_count', 0)}\n"
        message += f"Применено действий: {report_data.get('actions_count', 0)}\n\n"
        message += "Подробности в личном кабинете."
        
        await self.send_message(telegram_id, message) 