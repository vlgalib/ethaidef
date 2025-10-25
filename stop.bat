@echo off
echo Stopping CrossYield Agent application...

echo.
echo Closing CrossYield application windows by title...

echo.
echo Closing CrossYield-Backend window...
taskkill /f /fi "WINDOWTITLE eq CrossYield-Backend*" >nul 2>&1

echo.
echo Closing CrossYield-Frontend window...
taskkill /f /fi "WINDOWTITLE eq CrossYield-Frontend*" >nul 2>&1

echo.
echo Checking and killing specific processes on ports 5000 and 3000...

echo.
echo Checking backend (port 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 5000
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo Checking frontend (port 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 3000
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo CrossYield Agent processes stopped!
echo Ports 5000 and 3000 are now free.
echo Other Node.js and Python processes (like Claude Code) remain running.
echo.
pause