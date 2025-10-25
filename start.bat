@echo off
echo Starting CrossYield Agent application...

echo.
echo Starting Backend on port 5000...
start "CrossYield-Backend" cmd /k "cd backend && python main.py"

echo.
echo Waiting 3 seconds before starting frontend...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend on port 3000...
start "CrossYield-Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting...
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:3000
echo.
echo Services running with window titles:
echo - CrossYield-Backend (Python on port 5000)
echo - CrossYield-Frontend (Node.js on port 3000)
echo.
echo Press any key to close this window...
pause