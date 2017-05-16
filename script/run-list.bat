@echo off
cd ../spider/news.163.com
:dou
echo start list.js...
node list.js
echo end list.js...
ping -n 60 127.0>nul
goto dou
