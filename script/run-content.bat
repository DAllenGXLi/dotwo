@echo off
cd ../spider/news.163.com
:dou
echo start content.js...
node content.js
echo end content.js...
ping -n 30 127.0>nul
goto dou
