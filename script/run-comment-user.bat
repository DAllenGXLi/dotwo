@echo off
cd ../spider/news.163.com
:dou
echo start comment-user.js...
node comment-user.js
echo end comment-user.js...
ping -n 3 127.0>nul
goto dou
