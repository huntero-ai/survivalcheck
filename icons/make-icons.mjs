// Membuat PNG ikon tanpa dependensi: node icons/make-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xFFFFFFFF; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
}
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay; const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
// Koordinat dalam ruang 0..512. scale: ukuran isi (1 = penuh, maskable lebih kecil).
function sample(x, y, maskable) {
  const bg = [15, 107, 90], fg = [255, 255, 255];
  const rr = 96;
  if (!maskable) { // sudut membulat -> transparan
    const cx = Math.min(Math.max(x, rr), 512 - rr), cy = Math.min(Math.max(y, rr), 512 - rr);
    if (Math.hypot(x - cx, y - cy) > rr) return [0, 0, 0, 0];
  }
  const k = maskable ? 118 / 150 : 1, w = maskable ? 22 / 28 : 1;
  const ring = Math.abs(Math.hypot(x - 256, y - 256) - 150 * k) <= 14 * w;
  const s = maskable ? 0.79 : 1; const P = (px, py) => [256 + (px - 256) * s, 256 + (py - 256) * s];
  const [a1, a2] = [P(186, 262), P(236, 312)], [b1, b2] = [P(236, 312), P(328, 208)];
  const chk = Math.min(distSeg(x, y, ...a1, ...a2), distSeg(x, y, ...b1, ...b2)) <= 16 * (maskable ? 0.85 : 1);
  return ring || chk ? [...fg, 255] : [...bg, 255];
}
function png(size, maskable) {
  const SS = 3; const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let j = 0; j < size; j++) {
    raw[j * (size * 4 + 1)] = 0;
    for (let i = 0; i < size; i++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sj = 0; sj < SS; sj++) for (let si = 0; si < SS; si++) {
        const [pr, pg, pb, pa] = sample(((i + (si + .5) / SS) / size) * 512, ((j + (sj + .5) / SS) / size) * 512, maskable);
        r += pr * pa; g += pg * pa; b += pb * pa; a += pa;
      }
      const o = j * (size * 4 + 1) + 1 + i * 4;
      if (a > 0) { raw[o] = Math.round(r / a); raw[o + 1] = Math.round(g / a); raw[o + 2] = Math.round(b / a); }
      raw[o + 3] = Math.round(a / (SS * SS));
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
writeFileSync(join(dir, 'icon-192.png'), png(192, false));
writeFileSync(join(dir, 'icon-512.png'), png(512, false));
writeFileSync(join(dir, 'icon-maskable-512.png'), png(512, true));
console.log('ikon dibuat');
