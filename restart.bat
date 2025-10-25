@echo off
echo Restarting ETH AI Defense application...

echo.
echo Step 1: Stopping all processes...
call stop.bat

echo.
echo Step 2: Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting application...
call start.bat

echo.
echo Restart complete!