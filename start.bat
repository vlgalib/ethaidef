@echo off
echo Starting ETH AI Defense application...

echo.
echo Starting Backend...
start cmd /k "cd backend && python main.py"

echo.
echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:3000 (or 3001 if 3000 is busy)
echo.
echo Press any key to close this window...
pause