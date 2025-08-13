@echo off
pm2 delete index
timeout /t 3 /nobreak >nul
pm2 start index.js --name foam
pm2 save