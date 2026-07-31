import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let debounceTimer;
const DEBOUNCE_TIME = 15000; // 15 seconds

console.log("🚀 [Auto Deploy Watcher] Khởi động! Đang theo dõi thay đổi Code trong thư mục src/...");
console.log(`⏱️ Thời gian trễ (debounce): ${DEBOUNCE_TIME / 1000} giây`);

// Watch the src directory
const watcher = chokidar.watch(path.join(__dirname, 'src'), {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
});

watcher.on('all', (event, filePath) => {
  const fileName = path.basename(filePath);
  
  // Ignore specific files that shouldn't trigger deploy
  if (fileName.endsWith('.log') || fileName === 'vite-env.d.ts') return;

  console.log(`\n📝 [Auto Deploy Watcher] Phát hiện sửa đổi: ${fileName}`);
  console.log(`⏳ Chờ ${DEBOUNCE_TIME / 1000} giây để gộp các thay đổi...`);

  clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    console.log("☁️ [Auto Deploy Watcher] Đang gói Code và tự động đẩy lên GitHub/Vercel...");
    
    // Format current date and time for commit message
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN');
    const dateStr = now.toLocaleDateString('vi-VN');
    const commitMsg = `Auto deploy update ${timeStr} ${dateStr}`;

    console.log("📦 Đang tạo bản sao lưu (backup) trước khi tải lên...");
    exec(`node scratch/backup.cjs && git add . && git commit -m "${commitMsg}" && git push`, (err, stdout, stderr) => {
      if (err) {
        // If the error is just "nothing to commit", ignore it
        if (stdout.includes('nothing to commit') || stderr.includes('nothing to commit')) {
          console.log("👌 Không có thay đổi nào cần push (Git clean).");
        } else {
          console.error("❌ Lỗi khi tự động push:", err.message);
        }
        return;
      }
      
      console.log(`✅ [Auto Deploy Watcher] THÀNH CÔNG! Đã đẩy Code lên máy chủ lúc ${timeStr}!`);
      console.log("🌍 Vercel đang bắt đầu Build lại website.");
    });
  }, DEBOUNCE_TIME);
});
