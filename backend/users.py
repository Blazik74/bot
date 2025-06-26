from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

from .db import get_db, User, UserLog, AsyncSessionLocal
# from .utils import get_client_ip, get_user_agent

logger = logging.getLogger(__name__)

# Настройки JWT
SECRET_KEY = os.environ.get("SECRET_KEY", "your_fallback_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

class UserService:
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Создание JWT токена"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[int]:
        """Проверка JWT токена"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            user_id: int = payload.get("user_id")
            if user_id is None:
                return None
            return user_id
        except jwt.PyJWTError:
            return None
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Получение пользователя по ID"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User).where(User.id == user_id)
            )
            return result.scalar_one_or_none()
    
    async def get_user_by_facebook_id(self, facebook_id: str) -> Optional[User]:
        """Получение пользователя по Facebook ID"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User).where(User.facebook_id == facebook_id)
            )
            return result.scalar_one_or_none()
    
    async def get_user_by_telegram_id(self, telegram_id: str) -> Optional[User]:
        """Получение пользователя по Telegram ID"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            return result.scalar_one_or_none()
    
    async def create_user(self, user_data: Dict[str, Any]) -> User:
        """Создание нового пользователя"""
        async with AsyncSessionLocal() as session:
            user = User(**user_data)
            session.add(user)
            await session.commit()
            await session.refresh(user)
            
            # Логируем создание пользователя
            await self.log_user_action(
                user.id, 
                "user_created", 
                {"source": user_data.get("source", "unknown")}
            )
            
            return user
    
    async def update_user(self, user_id: int, update_data: Dict[str, Any]) -> User:
        """Обновление пользователя"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                update(User)
                .where(User.id == user_id)
                .values(**update_data, updated_at=datetime.utcnow())
                .returning(User)
            )
            user = result.scalar_one()
            await session.commit()
            
            # Логируем обновление
            await self.log_user_action(user_id, "profile_updated", update_data)
            
            return user
    
    async def update_facebook_connection(self, user_id: int, facebook_data: Dict[str, Any]) -> User:
        """Обновление Facebook подключения пользователя"""
        update_data = {
            "facebook_id": facebook_data.get("id"),
            "facebook_access_token": facebook_data.get("access_token"),
            "name": facebook_data.get("name"),
            "email": facebook_data.get("email"),
            "picture": facebook_data.get("picture"),
            "updated_at": datetime.utcnow()
        }
        
        return await self.update_user(user_id, update_data)
    
    async def disconnect_facebook(self, user_id: int) -> User:
        """Отключение Facebook аккаунта"""
        update_data = {
            "facebook_id": None,
            "facebook_access_token": None,
            "picture": None,
            "updated_at": datetime.utcnow()
        }
        
        return await self.update_user(user_id, update_data)
    
    async def get_profile(self, user_id: int) -> Dict[str, Any]:
        """Получение профиля пользователя с проверкой доступа"""
        async with AsyncSessionLocal() as session:
            # Загружаем пользователя вместе с его тарифом
            result = await session.execute(
                select(User).options(selectinload(User.tariff)).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")
            
            # Проверяем, не истек ли доступ
            if user.access_expires_at and user.access_expires_at < datetime.utcnow():
                # Доступ истек, переводим на бесплатный тариф
                user.tariff_id = 1
                user.access_expires_at = None
                await session.commit()
                # Перезагружаем данные тарифа
                await session.refresh(user, attribute_names=['tariff'])

            # Список пользователей с постоянным доступом
            permanent_access_usernames = ["blazik1", "isonim"]

            has_access = (
                user.role in ["admin", "superadmin"] or
                user.tariff_id > 1 or
                (user.username and user.username in permanent_access_usernames)
            )

            logger.info(
                f"Access check for user_id={user.id}, username='{user.username}': "
                f"role='{user.role}', tariff_id={user.tariff_id}, "
                f"expires_at='{user.access_expires_at}', has_access={has_access}"
            )

            return {
                "id": user.id,
                "name": user.name,
                "username": user.username,
                "avatar_url": user.avatar_url,
                "email": user.email,
                "picture": user.picture,
                "role": user.role,
                "has_access": has_access,
                "access_expires_at": user.access_expires_at.isoformat() if user.access_expires_at else None,
                "facebook_connected": bool(user.facebook_access_token),
                "telegram_connected": bool(user.telegram_id),
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "tariff": {
                    "id": user.tariff.id,
                    "name": user.tariff.name,
                    "campaigns_limit": user.tariff.campaigns_limit,
                    "features": user.tariff.features
                } if user.tariff else None
            }
    
    async def update_profile(self, user_id: int, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Обновление профиля пользователя"""
        # Разрешаем обновлять только определенные поля
        allowed_fields = {"name", "email"}
        filtered_data = {k: v for k, v in profile_data.items() if k in allowed_fields}
        
        if not filtered_data:
            raise HTTPException(status_code=400, detail="Нет данных для обновления")
        
        user = await self.update_user(user_id, filtered_data)
        return await self.get_profile(user.id)
    
    async def log_user_action(self, user_id: int, action: str, details: Optional[Dict] = None, 
                            ip_address: Optional[str] = None, user_agent: Optional[str] = None):
        """Логирование действий пользователя"""
        async with AsyncSessionLocal() as session:
            log = UserLog(
                user_id=user_id,
                action=action,
                details=details,
                ip_address=ip_address,
                user_agent=user_agent
            )
            session.add(log)
            await session.commit()
    
    async def get_user_logs(self, user_id: int, limit: int = 50, offset: int = 0) -> list:
        """Получение логов пользователя"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(UserLog)
                .where(UserLog.user_id == user_id)
                .order_by(UserLog.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
            logs = result.scalars().all()
            
            return [
                {
                    "id": log.id,
                    "action": log.action,
                    "details": log.details,
                    "ip_address": log.ip_address,
                    "user_agent": log.user_agent,
                    "created_at": log.created_at.isoformat() if log.created_at else None
                }
                for log in logs
            ]
    
    async def check_user_permissions(self, user_id: int, feature: str) -> bool:
        """Проверка прав пользователя на использование функции"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        
        # Получаем тариф пользователя
        async with AsyncSessionLocal() as session:
            from .db import Tariff
            result = await session.execute(
                select(Tariff).where(Tariff.id == user.tariff_id)
            )
            tariff = result.scalar_one_or_none()
        
        if not tariff or not tariff.is_active:
            return False
        
        # Проверяем права на функцию
        if feature == "autopilot":
            return tariff.features.get("autopilot", False)
        elif feature == "advanced_analytics":
            return tariff.features.get("advanced_analytics", False)
        elif feature == "custom_reports":
            return tariff.features.get("custom_reports", False)
        
        # Базовые функции доступны всем
        return True

# Функции для аутентификации
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Получение текущего пользователя из токена"""
    user_service = UserService()
    user_id = user_service.verify_token(credentials.credentials)
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь неактивен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Получение текущего пользователя (опционально)"""
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None

# Функции для Telegram WebApp аутентификации
def verify_telegram_webapp_data(init_data: str) -> Optional[Dict[str, Any]]:
    """Проверка данных Telegram WebApp"""
    try:
        # Здесь должна быть проверка HMAC подписи
        # Пока что упрощенная версия
        import urllib.parse
        parsed_data = dict(urllib.parse.parse_qsl(init_data))
        
        # Проверяем наличие обязательных полей
        required_fields = ["user", "auth_date"]
        if not all(field in parsed_data for field in required_fields):
            return None
        
        # Проверяем время (не старше 24 часов)
        auth_date = int(parsed_data["auth_date"])
        if datetime.utcnow().timestamp() - auth_date > 86400:
            return None
        
        return parsed_data
    except Exception as e:
        logger.error(f"Ошибка проверки Telegram данных: {e}")
        return None

async def authenticate_telegram_user(init_data: str, request) -> Optional[User]:
    """Аутентификация или создание пользователя через Telegram WebApp"""
    
    user_data = verify_telegram_webapp_data(init_data)
    if not user_data:
        return None
        
    user_info = user_data.get('user')
    if not user_info:
        return None

    # Если user_info — строка, парсим как JSON
    if isinstance(user_info, str):
        import json
        try:
            user_info = json.loads(user_info)
        except Exception:
            return None

    telegram_id = str(user_info['id'])
    
    user_service = UserService()
    user = await user_service.get_user_by_telegram_id(telegram_id)
    
    # ip = get_client_ip(request)
    # ua = get_user_agent(request)
    
    if user:
        # Пользователь найден, обновляем данные, если нужно
        update_data = {
            "name": f"{user_info.get('first_name', '')} {user_info.get('last_name', '')}".strip(),
            "username": user_info.get("username"),
            "avatar_url": user_info.get("photo_url"),
        }
        user = await user_service.update_user(user.id, {k: v for k, v in update_data.items() if v is not None})
        # await user_service.log_user_action(user.id, "login_telegram", {"ip": ip, "user_agent": ua})
    else:
        # Пользователь не найден, создаем нового
        new_user_data = {
            "telegram_id": telegram_id,
            "name": f"{user_info.get('first_name', '')} {user_info.get('last_name', '')}".strip(),
            "username": user_info.get("username"),
            "avatar_url": user_info.get("photo_url"),
            "source": "telegram" 
        }
        user = await user_service.create_user({k: v for k, v in new_user_data.items() if v is not None})
        # await user_service.log_user_action(user.id, "register_telegram", {"ip": ip, "user_agent": ua})
        
    return user
