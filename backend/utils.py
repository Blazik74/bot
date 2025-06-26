import logging
import sys
from fastapi import Request
from typing import Optional

def setup_logging():
    """
    Настраивает базовую конфигурацию логирования.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout,
    )
    # Уменьшаем "шум" от некоторых библиотек
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("apscheduler").setLevel(logging.INFO)

def get_client_ip(request: Request) -> Optional[str]:
    """
    Получение IP-адреса клиента из запроса.
    Учитывает заголовки прокси-серверов.
    """
    if "X-Forwarded-For" in request.headers:
        # Может содержать несколько IP: "client, proxy1, proxy2"
        return request.headers["X-Forwarded-For"].split(",")[0]
    
    if "X-Real-IP" in request.headers:
        return request.headers["X-Real-IP"]
    
    return request.client.host if request.client else None

def get_user_agent(request: Request) -> Optional[str]:
    """
    Получение User-Agent из запроса.
    """
    return request.headers.get("User-Agent") 