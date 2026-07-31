@echo off
chcp 65001 >nul
echo ====================================================
echo ĐANG TỰ ĐỘNG ĐƯA CODE MỚI LÊN MÁY CHỦ VERCEL...
echo ====================================================
echo DANG TAO BAN SAO LUU (BACKUP) TRUOC KHI DAY CODE...
node scratch\backup.cjs
git add .
git commit -m "Auto deploy update %date% %time%"
git push
echo ====================================================
echo DA XONG! Trang web cua ban tren Vercel dang duoc cap nhat.
echo Vui long doi khoang 1 phut roi F5 lai web.
echo ====================================================
pause
