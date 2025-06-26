from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import os
from datetime import datetime
import logging
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

Base = declarative_base()

DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "sqlite+aiosqlite:///./test.db"
)

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(String, unique=True, index=True, nullable=True)
    username = Column(String, unique=True, index=True, nullable=True)
    facebook_id = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    picture = Column(String, nullable=True)
    facebook_access_token = Column(Text, nullable=True)
    tariff_id = Column(Integer, ForeignKey("tariffs.id"), default=1)
    role = Column(String, default="user", nullable=False) 
    access_expires_at = Column(DateTime, nullable=True) 
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    campaigns = relationship("Campaign", back_populates="user")
    creatives = relationship("Creative", back_populates="user")
    logs = relationship("UserLog", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    autopilot_logs = relationship("AutopilotLog", back_populates="user")
    tariff = relationship("Tariff", back_populates="users")

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    facebook_campaign_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    account_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    objective = Column(String, nullable=True)
    budget = Column(Float, nullable=True)
    currency = Column(String, nullable=True)
    created_time = Column(DateTime, nullable=True)
    start_time = Column(DateTime, nullable=True)
    stop_time = Column(DateTime, nullable=True)
    insights = Column(JSON, nullable=True) 
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="campaigns")
    logs = relationship("CampaignLog", back_populates="campaign")

class Creative(Base):
    __tablename__ = "creatives"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    thumbnail_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates="creatives")

class Tariff(Base):
    __tablename__ = "tariffs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    campaigns_limit = Column(Integer, nullable=False)
    features = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    users = relationship("User", back_populates="tariff")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tariff_id = Column(Integer, ForeignKey("tariffs.id"))
    amount = Column(Float, nullable=False)
    currency = Column(String, default="RUB")
    payment_method = Column(String, nullable=False) 
    payment_id = Column(String, nullable=True) 
    status = Column(String, nullable=False)  
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="payments")
    tariff = relationship("Tariff")

class UserLog(Base):
    __tablename__ = "user_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates="logs")

class CampaignLog(Base):
    __tablename__ = "campaign_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=func.now())
    
    campaign = relationship("Campaign", back_populates="logs")

class AutopilotLog(Base):
    __tablename__ = "autopilot_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    details = Column(JSON, nullable=True)
    ai_suggestion = Column(Text, nullable=True)
    executed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates="autopilot_logs")

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Получение сессии базы данных"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Ошибка в сессии БД: {e}")
            raise
        finally:
            await session.close()

async def init_db():
    """Инициализирует базу данных, создавая таблицы, если они не существуют."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Создаем или обновляем базовые тарифы после создания таблиц
    async with AsyncSessionLocal() as session:
        await create_default_tariffs(session)
    
    logger.info("База данных успешно инициализирована.")

async def create_default_tariffs(session: AsyncSession):
    """Создание базовых тарифов"""
    from sqlalchemy import select
    default_tariffs = [
        {
            "id": 1,
            "name": "Бесплатный",
            "price": 0.0,
            "campaigns_limit": 0,
            "features": {
                "ai_suggestions": False,
                "autopilot": False,
            }
        },
        {
            "id": 2,
            "name": "Фрилансер",
            "price": 990.0,
            "campaigns_limit": 3,
            "features": {
                "ai_suggestions": True,
                "basic_analytics": True,
                "email_support": True,
                "autopilot": False,
            }
        },
        {
            "id": 3,
            "name": "Компания",
            "price": 2990.0,
            "campaigns_limit": 10,
            "features": {
                "ai_suggestions": True,
                "advanced_analytics": True,
                "autopilot": True,
                "priority_support": True,
                "custom_reports": True
            }
        }
    ]
    for tariff_data in default_tariffs:
        result = await session.execute(select(Tariff).where(Tariff.id == tariff_data["id"]))
        tariff = result.scalar_one_or_none()
        if tariff:
            for key, value in tariff_data.items():
                setattr(tariff, key, value)
        else:
            session.add(Tariff(**tariff_data))
    await session.commit()
    logger.info("Созданы/обновлены базовые тарифы")

async def close_db():
    """Закрытие соединения с базой данных"""
    await engine.dispose()
    logger.info("Соединение с БД закрыто") 
