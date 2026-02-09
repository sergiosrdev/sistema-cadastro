@echo off
echo Iniciando Sistema de Cadastro...
echo.
echo Iniciando o servidor backend...
start "Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
echo.
echo Iniciando o frontend...
start "Frontend" cmd /k "cd client && npm start"
echo.
echo Sistema iniciado!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
pause
