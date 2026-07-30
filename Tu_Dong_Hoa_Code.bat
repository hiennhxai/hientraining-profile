@echo off
chcp 65001 >nul
title Auto Deploy Watcher
echo ====================================================
echo KÍCH HOẠT CHẾ ĐỘ TỰ ĐỘNG HÓA CODE (AUTO DEPLOY)
echo ====================================================
echo Đang tải hệ thống giám sát...
npm run watch-deploy
pause
