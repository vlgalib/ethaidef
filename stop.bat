@echo off
echo Stopping ETH AI Defense application...

echo.
echo Killing processes on ports 5000, 3000, 3001, 3002...

echo.
echo Checking and killing backend (port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing process %%a on port 5000
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Checking and killing frontend (ports 3000-3002)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Killing process %%a on port 3000
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo Killing process %%a on port 3001
    taskkill /f /pid %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do (
    echo Killing process %%a on port 3002
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Killing any remaining Node.js and Python processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo.
echo All ETH AI Defense processes stopped!
echo Ports 5000, 3000-3002 are now free.
echo.
pause