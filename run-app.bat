@echo off
cd C:\Users\Click\Documents\angular\code\pos
cd dist
cd ..
call ng build --configuration=production
cd dist/pos

:: Stop the HTTP server if it's already running
taskkill /F /IM http-server >nul 2>&1

:: Start the HTTP server with the specified proxy and destination port
call http-server -c-1 --proxy http://localhost:9000 -p 8083
