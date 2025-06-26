#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
# Это важно для Render, чтобы он знал, если что-то пошло не так на старте.
set -e

# --- 1. Run initialization script ---
# Этот скрипт создает таблицы БД и устанавливает вебхук для Telegram.
# Он должен выполниться один раз перед запуском основных процессов.
echo "Running initialization script (db migration + webhook setup)..."
python -m backend.initialise
echo "Initialization completed."

echo "--- DEBUG INFO ---"
echo "Current working directory:"
pwd
echo "Listing files in the project root:"
ls -la
echo "--- END DEBUG INFO ---"

# Только после этого запускаем Gunicorn и воркеры!
echo "Starting Gunicorn web server..."
gunicorn -w 1 -k uvicorn.workers.UvicornWorker --preload backend.main:app --bind 0.0.0.0:$PORT &
GUNICORN_PID=$!
echo "Gunicorn started with PID: $GUNICORN_PID"

# --- 3. Start the Autopilot scheduler worker ---
echo "Starting Autopilot scheduler worker..."
python -m backend.worker &
WORKER_PID=$!
echo "Scheduler worker started with PID: $WORKER_PID"

# --- 4. Wait for either process to exit ---
# Скрипт будет ждать, пока один из фоновых процессов не завершится.
# Если упадет либо веб-сервер, либо воркер, Render перезапустит сервис.
wait -n $GUNICORN_PID $WORKER_PID

# Exit with the status of the process that exited first.
exit $? 
