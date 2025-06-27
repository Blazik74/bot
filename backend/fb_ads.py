import os
import httpx
from fastapi import HTTPException
from fastapi.responses import RedirectResponse
import logging
from typing import Dict, Any, Optional

from .users import UserService
from .db import User

logger = logging.getLogger(__name__)

class FacebookAdsService:
    def __init__(self):
        self.app_id = os.environ.get("FACEBOOK_APP_ID")
        self.app_secret = os.environ.get("FACEBOOK_APP_SECRET")
        self.redirect_uri = os.environ.get("FACEBOOK_REDIRECT_URI")
        self.api_version = "v19.0"
        self.base_graph_url = f"https://graph.facebook.com/{self.api_version}"
        self.user_service = UserService()

        if not all([self.app_id, self.app_secret, self.redirect_uri]):
            logger.warning("Facebook App credentials are not fully configured.")

    async def get_auth_url(self) -> RedirectResponse:
        """Генерация URL для OAuth авторизации Facebook"""
        if not all([self.app_id, self.redirect_uri]):
            raise HTTPException(status_code=500, detail="Facebook App credentials are not configured")
        
        scope = "email,public_profile,ads_management,ads_read,business_management"
        auth_url = (
            f"https://www.facebook.com/{self.api_version}/dialog/oauth?"
            f"client_id={self.app_id}"
            f"&redirect_uri={self.redirect_uri}"
            f"&scope={scope}"
            f"&response_type=code"
            f"&state=some_random_state_string"  # Рекомендуется использовать уникальный state
        )
        return RedirectResponse(auth_url)

    async def handle_callback(self, code: str) -> Dict[str, Any]:
        """Обработка callback от Facebook, обмен кода на токен"""
        long_lived_token = await self._exchange_code_for_token(code)
        user_info = await self._get_user_info(long_lived_token)
        
        facebook_id = user_info.get("id")
        if not facebook_id:
            raise HTTPException(status_code=400, detail="Не удалось получить Facebook ID")
            
        # Проверяем, есть ли уже пользователь с таким Facebook ID
        user = await self.user_service.get_user_by_facebook_id(facebook_id)
        
        user_picture_url = user_info.get("picture", {}).get("data", {}).get("url")

        if user:
            # Обновляем существующего пользователя
            update_data = {
                "facebook_access_token": long_lived_token,
                "name": user_info.get("name"),
                "email": user_info.get("email"),
                "picture": user_picture_url,
            }
            updated_user = await self.user_service.update_user(user.id, update_data)
        else:
            # Создаем нового пользователя
            new_user_data = {
                "facebook_id": facebook_id,
                "facebook_access_token": long_lived_token,
                "name": user_info.get("name"),
                "email": user_info.get("email"),
                "picture": user_picture_url,
                "tariff_id": 1,
                "is_active": True
            }
            updated_user = await self.user_service.create_user(new_user_data)

        # Создаем наш JWT токен для сессии
        jwt_token = self.user_service.create_access_token(data={"user_id": updated_user.id})
        
        return {
            "token": jwt_token,
            "user": {
                "id": updated_user.id,
                "name": updated_user.name,
                "picture": updated_user.picture,
                "facebook_id": updated_user.facebook_id,
                "facebook_page_url": f"https://www.facebook.com/{updated_user.facebook_id}"
            }
        }

    async def _exchange_code_for_token(self, code: str) -> str:
        """Обмен кода авторизации на долгосрочный токен доступа"""
        # 1. Обмен кода на краткосрочный токен
        async with httpx.AsyncClient() as client:
            token_url = f"{self.base_graph_url}/oauth/access_token"
            params = {
                'client_id': self.app_id,
                'client_secret': self.app_secret,
                'redirect_uri': self.redirect_uri,
                'code': code,
            }
            response = await client.get(token_url, params=params)
            token_data = response.json()

            if 'error' in token_data:
                logger.error(f"Failed to retrieve access token: {token_data['error']}")
                raise HTTPException(status_code=400, detail="Не удалось получить токен доступа")
            
            short_lived_token = token_data['access_token']

            # 2. Обмен краткосрочного токена на долгосрочный
            exchange_url = f"{self.base_graph_url}/oauth/access_token"
            params = {
                'grant_type': 'fb_exchange_token',
                'client_id': self.app_id,
                'client_secret': self.app_secret,
                'fb_exchange_token': short_lived_token
            }
            response = await client.get(exchange_url, params=params)
            long_lived_data = response.json()
            
            if 'error' in long_lived_data:
                logger.error(f"Failed to get long-lived token: {long_lived_data['error']}")
                raise HTTPException(status_code=400, detail="Не удалось получить долгосрочный токен")
            
            return long_lived_data['access_token']

    async def _get_user_info(self, access_token: str) -> Dict[str, Any]:
        """Получение информации о пользователе Facebook"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_graph_url}/me"
            params = {
                'fields': 'id,name,email,picture.type(large)',
                'access_token': access_token
            }
            response = await client.get(url, params=params)
            user_data = response.json()
            
            if 'error' in user_data:
                logger.error(f"Failed to retrieve user info: {user_data['error']}")
                raise HTTPException(status_code=400, detail="Не удалось получить информацию о пользователе")
            
            return user_data
    
    async def get_user_profile(self, user_id: int) -> Dict[str, Any]:
        """Получение профиля Facebook для авторизованного пользователя"""
        user = await self.user_service.get_user_by_id(user_id)
        if not user or not user.facebook_access_token:
            raise HTTPException(status_code=403, detail="Пользователь не подключен к Facebook")
        
        try:
            profile_info = await self._get_user_info(user.facebook_access_token)
            return {
                "name": profile_info.get("name"),
                "picture": profile_info.get("picture", {}).get("data", {}).get("url"),
                "facebook_id": profile_info.get("id"),
                "facebook_page_url": f"https://www.facebook.com/{profile_info.get('id')}"
            }
        except HTTPException as e:
            # Если токен истек, отключаем пользователя
            if e.status_code == 400:
                await self.user_service.disconnect_facebook(user_id)
                raise HTTPException(status_code=401, detail="Токен Facebook истек, требуется повторная авторизация")
            raise e

    async def disconnect_user(self, user_id: int):
        """Отключение пользователя от Facebook"""
        user = await self.user_service.get_user_by_id(user_id)
        if not user or not user.facebook_access_token:
            return

        # Хотя Facebook API не предоставляет прямого способа инвалидации токена,
        # мы можем отозвать разрешения пользователя
        async with httpx.AsyncClient() as client:
            url = f"{self.base_graph_url}/{user.facebook_id}/permissions"
            params = {'access_token': user.facebook_access_token}
            await client.delete(url, params=params)
        
        # Удаляем данные из нашей БД
        await self.user_service.disconnect_facebook(user_id)
        logger.info(f"Пользователь {user_id} отключен от Facebook")

    async def get_ad_accounts(self, user_id: int) -> list:
        """Получение списка рекламных аккаунтов"""
        user = await self.user_service.get_user_by_id(user_id)
        if not user or not user.facebook_access_token:
            raise HTTPException(status_code=403, detail="Пользователь не подключен к Facebook")
        
        async with httpx.AsyncClient() as client:
            url = f"{self.base_graph_url}/me/adaccounts"
            params = {
                'fields': 'id,name,account_status,currency,timezone_name,business_name',
                'access_token': user.facebook_access_token
            }
            response = await client.get(url, params=params)
            data = response.json()
            
            if 'error' in data:
                logger.error(f"Ошибка получения рекламных аккаунтов: {data['error']}")
                raise HTTPException(status_code=400, detail="Ошибка получения рекламных аккаунтов")
            
            return data.get('data', [])

    # Другие методы для работы с кампаниями, адсетами и рекламой будут здесь 
