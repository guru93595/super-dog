@echo off
cd /d %~dp0
if not exist node_modules call npm install
if not exist node_modules\electron\dist node node_modules\electron\install.js
call npm start
