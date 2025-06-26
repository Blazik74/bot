import openai
import os
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.environ.get("OPENAI_API_KEY")
        if not self.api_key or self.api_key == "not_set":
            logger.warning("OPENAI_API_KEY is not set. AI Service will not be available.")
            self.client = None
        else:
            self.client = openai.OpenAI(api_key=self.api_key)

    async def get_suggestions(self, user_id: int, campaign_data: dict) -> list:
        if not self.client:
            return ["Сервис ИИ недоступен. Проверьте ключ API на сервере."]

        try:
            # Упрощенный пример промпта
            prompt = f"""
            Проанализируй данные рекламной кампании и дай 3 коротких совета по ее улучшению.
            Данные: {campaign_data}
            Ответ дай в виде списка Python.
            """

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Ты — опытный маркетолог, ассистент в рекламном кабинете."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.choices[0].message.content
            # Пытаемся безопасно распарсить ответ
            suggestions = eval(content)
            if isinstance(suggestions, list):
                return suggestions
            else:
                return ["Не удалось разобрать ответ от ИИ."]

        except Exception as e:
            logger.error(f"Ошибка при получении рекомендаций от OpenAI: {e}")
            return [f"Ошибка связи с ИИ: {e}"]

    def _create_prompt(self, campaign_data: Dict[str, Any]) -> str:
        """
        Создает текстовый промпт для GPT на основе метрик кампании.
        """
        # Пример простого промпта, можно усложнять
        prompt = f"""
Анализ рекламной кампании:
- Название: {campaign_data.get('name', 'N/A')}
- Цель: {campaign_data.get('objective', 'N/A')}
- Статус: {campaign_data.get('status', 'N/A')}

Ключевые метрики:
- Потрачено: {campaign_data.get('spend', 0)} {campaign_data.get('currency', '')}
- Показы: {campaign_data.get('impressions', 0)}
- Клики: {campaign_data.get('clicks', 0)}
- CTR: {campaign_data.get('ctr', 0)}%
- CPC: {campaign_data.get('cpc', 0)} {campaign_data.get('currency', '')}
- CPM: {campaign_data.get('cpm', 0)} {campaign_data.get('currency', '')}
- Результаты (лиды, покупки и т.д.): {campaign_data.get('results', 0)}
- Стоимость результата: {campaign_data.get('cost_per_result', 0)} {campaign_data.get('currency', '')}

Проанализируй эти данные и дай 3-5 конкретных советов по улучшению. 
Например: 'Попробуйте изменить креатив X', 'Увеличьте бюджет для аудитории Y', 'Остановите показ на площадке Z'.
"""
        return prompt 