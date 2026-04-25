@echo off
echo Iniciando Backend...
start cmd /k "cd backend && npm run dev"
echo Iniciando Frontend...
start cmd /k "cd frontend && npm run dev"
echo Sistema Contable Nexium iniciado.
pause
