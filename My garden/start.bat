@echo off
title Harbor Garden Local Server
echo Starting Harbor Garden Web & Database Server...
start "" http://localhost:3000/
node server.js
pause
