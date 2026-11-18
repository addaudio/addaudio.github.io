import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, '..', 'public', 'icons');
mkdirSync(iconsDir, { recursive: true });

// CRC32 helper for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    raw[rowStart] = 0; // filter type 0
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflateSync(raw, { level: 9 })),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function sdRoundedRect(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - hw + r;
  const qy = Math.abs(py - cy) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function sdTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const e0x = bx - ax, e0y = by - ay;
  const e1x = cx - bx, e1y = cy - by;
  const e2x = ax - cx, e2y = ay - cy;
  const v0x = px - ax, v0y = py - ay;
  const v1x = px - bx, v1y = py - by;
  const v2x = px - cx, v2y = py - cy;

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const pq0 = Math.hypot(v0x - e0x * clamp((v0x * e0x + v0y * e0y) / (e0x * e0x + e0y * e0y)),
                         v0y - e0y * clamp((v0x * e0x + v0y * e0y) / (e0x * e0x + e0y * e0y)));
  const pq1 = Math.hypot(v1x - e1x * clamp((v1x * e1x + v1y * e1y) / (e1x * e1x + e1y * e1y)),
                         v1y - e1y * clamp((v1x * e1x + v1y * e1y) / (e1x * e1x + e1y * e1y)));
  const pq2 = Math.hypot(v2x - e2x * clamp((v2x * e2x + v2y * e2y) / (e2x * e2x + e2y * e2y)),
                         v2y - e2y * clamp((v2x * e2x + v2y * e2y) / (e2x * e2x + e2y * e2y)));

  const s = Math.sign(e0x * e2y - e0y * e2x);
  const d = Math.min(pq0, pq1, pq2);
  const inside =
    s * (v0x * e0y - v0y * e0x) >= 0 &&
    s * (v1x * e1y - v1y * e1x) >= 0 &&
    s * (v2x * e2y - v2y * e2x) >= 0;
  return inside ? -d : d;
}

function blend(dstR, dstG, dstB, dstA, srcR, srcG, srcB, srcA) {
  const a = srcA / 255;
  const outA = a + (dstA / 255) * (1 - a);
  if (outA <= 0) return [0, 0, 0, 0];
  return [
    (srcR * a + dstR * (dstA / 255) * (1 - a)) / outA,
    (srcG * a + dstG * (dstA / 255) * (1 - a)) / outA,
    (srcB * a + dstB * (dstA / 255) * (1 - a)) / outA,
    outA * 255,
  ];
}

function renderIcon(size, maskable = false) {
  const rgba = Buffer.alloc(size * size * 4);
  const ss = 3; // 3x3 supersampling
  const scale = maskable ? 0.82 : 1;
  const offset = (1 - scale) * 256;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let accR = 0, accG = 0, accB = 0, accA = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const ux = ((x + (sx + 0.5) / ss) / size) * 512;
          const uy = ((y + (sy + 0.5) / ss) / size) * 512;

          let r = 0, g = 0, b = 0, a = 0;

          if (maskable) {
            // Full bleed background for maskable icons
            const t = (ux + uy) / 1024;
            r = 185 + (154 - 185) * t;
            g = 152 + (118 - 152) * t;
            b = 128 + (94 - 128) * t;
            a = 255;
          } else {
            const dBg = sdRoundedRect(ux, uy, 256, 256, 240, 240, 112);
            if (dBg <= 0) {
              const t = (ux + uy) / 1024;
              r = 185 + (154 - 185) * t;
              g = 152 + (118 - 152) * t;
              b = 128 + (94 - 128) * t;
              a = 255;
            }
          }

          // Transform coordinates for inner artwork
          const ax = (ux - offset) / scale;
          const ay = (uy - offset) / scale;

          // Rounded play triangle (centered horizontally around x=256)
          const dTri = sdTriangle(ax, ay, 122, 164, 276, 256, 122, 348) - 10;
          if (dTri <= 0 && a > 0) {
            [r, g, b, a] = blend(r, g, b, a, 255, 251, 233, 255);
          }

          // Waveform bars
          const dBar1 = sdRoundedRect(ax, ay, 309, 256, 13, 60, 13);
          const dBar2 = sdRoundedRect(ax, ay, 351, 256, 13, 112, 13);
          const dBar3 = sdRoundedRect(ax, ay, 393, 256, 13, 44, 13);

          if ((dBar1 <= 0 || dBar3 <= 0) && a > 0) {
            [r, g, b, a] = blend(r, g, b, a, 227, 202, 165, 255);
          }
          if (dBar2 <= 0 && a > 0) {
            [r, g, b, a] = blend(r, g, b, a, 255, 251, 233, 255);
          }

          accR += r;
          accG += g;
          accB += b;
          accA += a;
        }
      }
      const samples = ss * ss;
      const idx = (y * size + x) * 4;
      rgba[idx] = Math.round(accR / samples);
      rgba[idx + 1] = Math.round(accG / samples);
      rgba[idx + 2] = Math.round(accB / samples);
      rgba[idx + 3] = Math.round(accA / samples);
    }
  }
  return encodePNG(size, size, rgba);
}

writeFileSync(join(iconsDir, 'icon-192.png'), renderIcon(192, false));
writeFileSync(join(iconsDir, 'icon-512.png'), renderIcon(512, false));
writeFileSync(join(iconsDir, 'icon-512-maskable.png'), renderIcon(512, true));
writeFileSync(join(iconsDir, 'apple-touch-icon.png'), renderIcon(180, true));

console.log('[generate-icons] Generated PNG icons in public/icons/');
