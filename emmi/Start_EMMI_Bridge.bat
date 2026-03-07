@echo off
title EMMI Bridge Launcher
echo ==============================================
echo    Starting EMMI Bridge and Security Proxy...
echo ==============================================
echo.

:: Start the original bridge executable in its own minimized window
start "EMMI Bridge" /min "emmi bridge\dist\emmi-bridge.exe"

:: Wait a moment for the bridge to start before launching the proxy
timeout /t 2 /nobreak >nul

:: Start the proxy in its own visible window so users can see it working
start "EMMI Proxy" emmi_proxy.exe

echo.
echo Both services have been started!
echo.
echo  - The BRIDGE window is minimized (handles hardware).
echo  - The PROXY window shows connection logs.
echo.
echo Your EMMI BOT IDE on GitHub should now show ONLINE.
echo You can close THIS window, but keep the other two running.
echo.
pause
