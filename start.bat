@echo off
echo.
echo ╔══════════════════════════════════════╗
echo ║       CHEF AI — Starting Server      ║
echo ╚══════════════════════════════════════╝
echo.
echo [1/2] Starting Python backend on http://localhost:8000 ...
start "CHEF Backend" cmd /k "uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak > NUL

echo [2/2] Starting React frontend on http://localhost:5173 ...
start "CHEF Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✔ CHEF is running!
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:5173
echo.
pause
