@echo off
cd ../trainning
:dou
echo start analyse-all.py...
python analyse-all.py
echo end analyse-all.py...
ping -n 60 127.0>nul
goto dou
