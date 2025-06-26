from fastapi import UploadFile, File
import os
import aiofiles
import logging
from typing import Dict, Any, List
import uuid
from pathlib import Path

# from db import Creative, AsyncSessionLocal
# from sqlalchemy import select

logger = logging.getLogger(__name__)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

class UploadService:
    async def upload_file(self, file: UploadFile, user_id: int) -> Dict[str, Any]:
        """
        Сохраняет загруженный файл и записывает информацию в базу данных.
        """
        original_filename = file.filename
        file_extension = Path(original_filename).suffix
        new_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / new_filename
        
        try:
            # Асинхронное сохранение файла
            async with aiofiles.open(file_path, 'wb') as out_file:
                content = await file.read()
                await out_file.write(content)
            
            file_size = file_path.stat().st_size
            file_type = "image" if file.content_type.startswith("image") else "video"

            # Логика сохранения в БД (пока закомментирована)
            # creative = Creative(
            #     user_id=user_id,
            #     filename=new_filename,
            #     original_filename=original_filename,
            #     file_type=file_type,
            #     file_size=file_size,
            #     file_path=str(file_path)
            # )
            # async with AsyncSessionLocal() as session:
            #     session.add(creative)
            #     await session.commit()
            
            logger.info(f"Файл {original_filename} успешно загружен пользователем {user_id} как {new_filename}")
            
            return {
                "message": "Файл успешно загружен",
                "filename": new_filename,
                "original_filename": original_filename,
                "file_path": str(file_path),
                "file_type": file_type,
                "file_size": file_size,
                "preview_url": f"/uploads/{new_filename}" # FastAPI должен быть настроен для раздачи статики
            }
        except Exception as e:
            logger.error(f"Ошибка при загрузке файла {original_filename}: {e}")
            raise
    
    async def get_user_creatives(self, user_id: int) -> List[Dict[str, Any]]:
        """
        Получение списка креативов для пользователя.
        """
        # async with AsyncSessionLocal() as session:
        #     result = await session.execute(
        #         select(Creative).where(Creative.user_id == user_id)
        #     )
        #     creatives = result.scalars().all()
        #     return [
        #         {
        #             "id": c.id,
        #             "filename": c.filename,
        #             "original_filename": c.original_filename,
        #             "file_type": c.file_type,
        #             "preview_url": f"/uploads/{c.filename}",
        #             "created_at": c.created_at.isoformat()
        #         }
        #         for c in creatives
        #     ]
        # Заглушка, пока нет полной интеграции с БД
        return [] 