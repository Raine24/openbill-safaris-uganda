@echo off
cd /d "%~dp0"
echo Starting Openbill Safaris local server at http://127.0.0.1:8080/index.html ...
start "" "http://127.0.0.1:8080/index.html"
python -m http.server 8080 --bind 127.0.0.1
pause
