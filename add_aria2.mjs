import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx')) filelist.push(dirFile);
    }
  }
  return filelist;
}

const files = walkSync(path.join(__dirname, 'src', 'components'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/<button(\s+)/g, (match, p1, offset, string) => {
    // Check if aria-label exists within the next 200 characters before a closing >
    const nextText = string.substring(offset, offset + 200);
    if (nextText.includes('aria-label=')) return match;
    return '<button aria-label="Action button"' + p1;
  });
  if (content !== newContent) fs.writeFileSync(file, newContent, 'utf8');
}
console.log('Done');
