@echo off
echo Starting ETH AI Defense application...

echo.
echo Starting Backend...
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python main.py"

echo.
echo Waiting 5 seconds before starting frontend...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:3000
echo.
pause