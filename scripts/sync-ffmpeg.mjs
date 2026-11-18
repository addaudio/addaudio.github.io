import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const publicFfmpegDir = join(rootDir, 'public', 'ffmpeg');

const copies = [
  // Single-threaded fallback core (works without SharedArrayBuffer / low-memory devices)
  {
    src: join(rootDir, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm', 'ffmpeg-core.js'),
    dest: join(publicFfmpegDir, 'st', 'ffmpeg-core.js'),
  },
  {
    src: join(rootDir, 'node_modules', '@ffmpeg', 'core', 'dist', 'esm', 'ffmpeg-core.wasm'),
    dest: join(publicFfmpegDir, 'st', 'ffmpeg-core.wasm'),
  },
  // Multi-threaded SharedArrayBuffer core (fast processing via COI Service Worker)
  {
    src: join(rootDir, 'node_modules', '@ffmpeg', 'core-mt', 'dist', 'esm', 'ffmpeg-core.js'),
    dest: join(publicFfmpegDir, 'mt', 'ffmpeg-core.js'),
  },
  {
    src: join(rootDir, 'node_modules', '@ffmpeg', 'core-mt', 'dist', 'esm', 'ffmpeg-core.wasm'),
    dest: join(publicFfmpegDir, 'mt', 'ffmpeg-core.wasm'),
  },
  {
    src: join(rootDir, 'node_modules', '@ffmpeg', 'core-mt', 'dist', 'esm', 'ffmpeg-core.worker.js'),
    dest: join(publicFfmpegDir, 'mt', 'ffmpeg-core.worker.js'),
  },
];

for (const { src, dest } of copies) {
  if (!existsSync(src)) {
    throw new Error(`Missing FFmpeg core asset: ${src}. Run npm install first.`);
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

console.log('[sync-ffmpeg] Synced @ffmpeg/core (st) and @ffmpeg/core-mt (mt) assets to public/ffmpeg/');
