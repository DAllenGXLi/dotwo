@echo off
cd ../dotwoweb
:dou
echo start web...
npm start
echo end web...
ping -n 3 127.0>nul
goto dou
