from fastapi import FastAPI, Request, Response, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from typing import List, Optional
from pydantic import BaseModel

# Импорты наших модулей
from .db import get_db
from .users import UserService, get_current_user, User, authenticate_telegram_user
from .fb_ads import FacebookAdsService
from .ai import AIService
from .autopilot import AutopilotService
from .uploads import UploadService
from .billing import BillingService
from .telegram_notify import TelegramNotifyService
from .utils import setup_logging
from .bot import setup_bot, TELEGRAM_BOT_TOKEN
from telegram import Update
from http import HTTPStatus


# Настройка логирования
setup_logging()
logger = logging.getLogger(__name__)


# Создание FastAPI приложения
app = FastAPI(
    title="Pixel AI Bot",
    description="API для управления рекламными кампаниями Facebook с ИИ",
    version="0.1.0",
)

# --- Настройка CORS ---
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    os.environ.get("FRONTEND_URL", "http://localhost:3000") 
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Инициализация сервисов ---
user_service = UserService()
fb_ads_service = FacebookAdsService()
ai_service = AIService()
autopilot_service = AutopilotService()
upload_service = UploadService()
billing_service = BillingService()
telegram_notify_service = TelegramNotifyService()

# --- Инициализация Telegram бота ---
bot_app = None

class TelegramAuthData(BaseModel):
    initData: str

@app.on_event("startup")
async def startup_event():
    global bot_app
    bot_app = setup_bot(webhook_mode=True)
    await bot_app.initialize()


# --- Роутеры ---

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Pixel AI API"}

@app.get("/api/test/access", summary="Тест доступа")
async def test_access(current_user: User = Depends(get_current_user)):
    """Тестовый эндпоинт для проверки доступа пользователя"""
    try:
        profile_data = await user_service.get_profile(current_user.id)
        return {
            "message": "Доступ разрешен",
            "user": profile_data,
            "debug": {
                "user_id": current_user.id,
                "role": current_user.role,
                "tariff_id": current_user.tariff_id,
                "has_access": profile_data.get("has_access"),
                "can_access_app": profile_data.get("has_access") or current_user.role in ["admin", "superadmin"] or current_user.tariff_id > 1
            }
        }
    except Exception as e:
        logger.error(f"Test access error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка тестирования доступа")

# -- Пользователи --
@app.get("/api/user/profile", summary="Получить профиль пользователя")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    try:
        profile_data = await user_service.get_profile(current_user.id)
        return profile_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error getting profile for user {current_user.id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка получения профиля")

@app.post("/api/auth/telegram", summary="Аутентификация через Telegram WebApp")
async def telegram_auth(auth_data: TelegramAuthData, request: Request):
    try:
        init_data = auth_data.initData
        
        # Аутентифицируем пользователя через Telegram
        user = await authenticate_telegram_user(init_data, request)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid Telegram data")
        
        # Создаем JWT токен
        user_service_instance = UserService()
        token = user_service_instance.create_access_token({"user_id": user.id})
        
        # Получаем профиль пользователя
        profile_data = await user_service.get_profile(user.id)
        
        return {
            "token": token,
            "user": profile_data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Telegram auth error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка аутентификации")

@app.put("/api/user/profile", summary="Обновить профиль пользователя")
async def update_user_profile(request: Request, current_user: User = Depends(get_current_user)):
    try:
        profile_data = await request.json()
        updated_user = await user_service.update_profile(current_user.id, profile_data)
        return updated_user
    except Exception as e:
        logger.error(f"Error updating profile for user {current_user.id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка обновления профиля")


# -- Facebook --
@app.get("/api/facebook/login_url", summary="Получить URL для входа через Facebook")
def get_facebook_login_url():
    return fb_ads_service.get_login_url()

@app.post("/api/facebook/exchange_code", summary="Обменять код авторизации на токен доступа")
async def exchange_code(request: Request, current_user: User = Depends(get_current_user)):
    try:
        body = await request.json()
        code = body.get("code")
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code is required")
        
        return await fb_ads_service.exchange_code_for_token(code, current_user.id)
    except Exception as e:
        logger.error(f"Facebook code exchange failed for user {current_user.id}: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/facebook/accounts", summary="Получить рекламные аккаунты")
async def get_ad_accounts(current_user: User = Depends(get_current_user)):
    return await fb_ads_service.get_ad_accounts(current_user.id)

# -- Кампании --
@app.get("/api/campaigns", summary="Получить список кампаний")
async def get_campaigns(account_id: str, current_user: User = Depends(get_current_user)):
    return await fb_ads_service.get_campaigns(user_id=current_user.id, account_id=account_id)

@app.post("/api/campaigns/{campaign_id}/toggle", summary="Включить/выключить кампанию")
async def toggle_campaign_status(campaign_id: str, current_user: User = Depends(get_current_user)):
    return await fb_ads_service.toggle_campaign_status(user_id=current_user.id, campaign_id=campaign_id)


# -- Креативы --
@app.post("/api/creatives/upload", summary="Загрузить креатив")
async def upload_creative(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    return await upload_service.upload_file(file, current_user.id)

@app.get("/api/creatives", summary="Получить список креативов")
async def get_creatives(current_user: User = Depends(get_current_user)):
    return await upload_service.get_user_creatives(current_user.id)

# -- ИИ --
@app.post("/api/ai/suggestions", summary="Получить рекомендации от ИИ")
async def get_ai_suggestions(request: Request, current_user: User = Depends(get_current_user)):
    body = await request.json()
    return await ai_service.get_suggestions(user_id=current_user.id, context=body)


# -- Тарифы и Биллинг --
@app.get("/api/tariffs", summary="Получить список тарифов")
async def get_tariffs(current_user: User = Depends(get_current_user)):
    return await billing_service.get_tariffs()

@app.post("/api/billing/subscribe", summary="Подписаться на тариф")
async def subscribe(request: Request, current_user: User = Depends(get_current_user)):
    body = await request.json()
    tariff_id = body.get("tariff_id")
    return await billing_service.subscribe_user(user_id=current_user.id, tariff_id=tariff_id)

@app.put("/api/user/tariff", summary="Обновить тариф пользователя")
async def update_user_tariff(request: Request, current_user: User = Depends(get_current_user)):
    try:
        body = await request.json()
        tariff_id = body.get("tariff_id")
        if not tariff_id:
            raise HTTPException(status_code=400, detail="tariff_id is required")
        
        # Обновляем тариф пользователя
        await user_service.update_user(current_user.id, {"tariff_id": tariff_id})
        
        # Возвращаем обновленный профиль
        return await user_service.get_profile(current_user.id)
    except Exception as e:
        logger.error(f"Error updating tariff for user {current_user.id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка обновления тарифа")


# -- Эндпоинт для Telegram Webhook --
@app.post("/telegram/{token}")
async def telegram_webhook(request: Request, token: str):
    if token != TELEGRAM_BOT_TOKEN:
        logger.warning("Received webhook update with invalid token.")
        raise HTTPException(status_code=403, detail="Invalid token")
    try:
        logger.info(f"Webhook called: {request.method} {request.url}")
        update_data = await request.json()
        update = Update.de_json(data=update_data, bot=bot_app.bot)
        await bot_app.process_update(update)
        return Response(status_code=HTTPStatus.OK)
    except Exception as e:
        logger.error(f"Error processing webhook update: {e}", exc_info=True)
        return Response(status_code=HTTPStatus.INTERNAL_SERVER_ERROR)


# Запуск приложения
if __name__ == "__main__":
    import uvicorn
    logging.info("Starting application in local development mode...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
