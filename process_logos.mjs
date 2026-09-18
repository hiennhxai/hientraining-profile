/**
 * process_logos.mjs - Re-process logos to keep their natural aspect ratios!
 * Forcing a square canvas made wide logos tiny.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, "public", "logos");
const WHITE_THRESHOLD = 240;

async function removeWhiteBackground(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  const cornerPixels = [
    [0, 0], [width - 1, 0],
    [0, height - 1], [width - 1, height - 1]
  ].map(([x, y]) => {
    const i = (y * width + x) * channels;
    return pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
  });
  const avgBrightness = cornerPixels.reduce((s, v) => s + v, 0) / 4;
  if (avgBrightness <= 200) return sharp(inputBuffer).ensureAlpha().png().toBuffer();

  const visited = new Uint8Array(width * height);
  const queue = [];
  const isBackground = (i) => pixels[i] >= WHITE_THRESHOLD && pixels[i+1] >= WHITE_THRESHOLD && pixels[i+2] >= WHITE_THRESHOLD;
  const addToQueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    if (isBackground(idx * channels)) { visited[idx] = 1; queue.push([x, y]); }
  };
  for (let x = 0; x < width; x++) { addToQueue(x, 0); addToQueue(x, height - 1); }
  for (let y = 0; y < height; y++) { addToQueue(0, y); addToQueue(width - 1, y); }
  while (queue.length > 0) {
    const [x, y] = queue.pop();
    addToQueue(x+1,y); addToQueue(x-1,y); addToQueue(x,y+1); addToQueue(x,y-1);
  }
  for (let i = 0; i < width * height; i++) {
    if (visited[i]) pixels[i * channels + 3] = 0;
  }
  return sharp(Buffer.from(pixels), { raw: { width, height, channels } }).png().toBuffer();
}

async function trimLogo(inputBuffer) {
  // Trim transparent pixels and return with natural dimensions
  const trimmed = await sharp(inputBuffer).trim({ threshold: 10 }).png().toBuffer().catch(() => inputBuffer);
  
  // Resize if too large, but keep aspect ratio
  const meta = await sharp(trimmed).metadata();
  if (meta.width > 800 || meta.height > 800) {
     return sharp(trimmed).resize(800, 800, { fit: 'inside' }).png({ compressionLevel: 8 }).toBuffer();
  }
  
  return sharp(trimmed).png({ compressionLevel: 8 }).toBuffer();
}

async function processLogo(filePath, backupFilePath) {
  const filename = path.basename(filePath);
  try {
    // Read from the backup so we process the original, not the already-squared one
    const inputBuffer = fs.readFileSync(backupFilePath);
    const meta = await sharp(inputBuffer).metadata();
    let processed;
    if (meta.hasAlpha) {
      processed = await trimLogo(inputBuffer);
    } else {
      const nobg = await removeWhiteBackground(inputBuffer);
      processed = await trimLogo(nobg);
    }
    fs.writeFileSync(filePath, processed);
    console.log("OK " + filename + "  " + Math.round(inputBuffer.length/1024) + "KB -> " + Math.round(processed.length/1024) + "KB");
  } catch (err) {
    console.error("FAIL " + filename + ": " + err.message);
  }
}

async function main() {
  // Find the most recent backup folder
  const folders = fs.readdirSync(LOGOS_DIR).filter(f => f.startsWith("_backup_")).sort();
  if (folders.length === 0) {
    console.error("No backup folder found. Cannot restore original aspect ratios.");
    return;
  }
  const latestBackup = path.join(LOGOS_DIR, folders[folders.length - 1]);
  console.log("Using originals from: " + latestBackup);
  
  const files = fs.readdirSync(latestBackup)
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  
  console.log("Found " + files.length + " logos to re-process...");

  for (const file of files) {
    await processLogo(path.join(LOGOS_DIR, file), path.join(latestBackup, file));
  }
  console.log("DONE! All logos re-processed to natural aspect ratios.");
}

main().catch(console.error);
