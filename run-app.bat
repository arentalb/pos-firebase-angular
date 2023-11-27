@echo off
cd C:\Users\Click\Documents\angular\code\pos
cd dist
cd ..
call ng build --configuration=production
cd dist/pos

:: Stop the HTTP server if it's already running
taskkill /F /IM http-server >nul 2>&1

http-server -c-1 --proxy http://localhost:8083/firebase-api -p 9002



