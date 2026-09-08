@echo off
title MindMatters AI Full-Stack Server
echo ============================================================
echo   Starting MindMatters AI (FastAPI Backend + Vite Frontend)
echo ============================================================
echo.

cd /d "%~dp0\backend"
start "MindMatters Backend (:8000)" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

cd /d "%~dp0"
start "MindMatters Frontend (:5173)" cmd /k "npm run dev"

echo Servers launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000
echo.
timeout /t 3 >nul
start http://localhost:5173
