@echo off
title EMMI Bridge Launcher
echo ==============================================
echo    Starting EMMI Bridge and Security Proxy...
echo ==============================================
echo.

:: Start the original bridge executable silently
start /b "" "emmi bridge\dist\emmi-bridge.exe"

:: Start the new proxy executable silently
start /b "" "emmi_proxy.exe"

echo Both services are successfully running in the background!
echo You can safely close this window. Your EMMI BOT IDE on GitHub is now ONLINE.
echo.
pause
