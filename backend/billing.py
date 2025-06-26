import logging
from typing import Dict, Any, List

from .db import Tariff, AsyncSessionLocal
from sqlalchemy import select
from .users import UserService

logger = logging.getLogger(__name__)

class BillingService:
    async def get_tariffs(self) -> List[Dict[str, Any]]:
        """
        Получение списка доступных тарифов.
        """
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Tariff).where(Tariff.is_active == True)
            )
            tariffs = result.scalars().all()
            return [
                {
                    "id": t.id,
                    "name": t.name,
                    "price": t.price,
                    "campaigns_limit": t.campaigns_limit,
                    "features": t.features,
                }
                for t in tariffs
            ]

    async def subscribe_user(self, user_id: int, subscription_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Обработка подписки пользователя на тариф.
        Здесь будет интеграция с платежными системами.
        """
        tariff_id = subscription_data.get("tariff_id")
        payment_method = subscription_data.get("payment_method") # "telegram", "stripe", etc.
        
        logger.info(f"Пользователь {user_id} инициировал подписку на тариф {tariff_id} через {payment_method}")
        
        # Обновляем тариф у пользователя
        user_service = UserService()
        await user_service.update_user(user_id, {"tariff_id": tariff_id})
        
        return {"message": "Подписка успешно оформлена", "status": "completed"}

    async def get_payment_history(self, user_id: int) -> List[Dict[str, Any]]:
        """
        Получение истории платежей пользователя.
        """
        # Заглушка
        return []

    async def handle_payment_callback(self, payment_data: Dict[str, Any]):
        """
        Обработка callback от платежной системы.
        """
        # 1. Найти платеж в БД по payment_id
        # 2. Проверить статус платежа
        # 3. Если "completed", обновить статус в БД и тариф пользователя
        # 4. Отправить уведомление пользователю
        logger.info(f"Получен callback от платежной системы: {payment_data}")
        pass 
