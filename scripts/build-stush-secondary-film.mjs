import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import p0 from '../src/lib/stush-secondary-film/part0.js';
import p1 from '../src/lib/stush-secondary-film/part1.js';
import p2 from '../src/lib/stush-secondary-film/part2.js';
import p3 from '../src/lib/stush-secondary-film/part3.js';
import p4 from '../src/lib/stush-secondary-film/part4.js';
import p5 from '../src/lib/stush-secondary-film/part5.js';
import p6 from '../src/lib/stush-secondary-film/part6.js';
import p7 from '../src/lib/stush-secondary-film/part7.js';

const base64 = `${p0}${p1}${p2}${p3}${p4}${p5}${p6}${p7}`;
const bytes = Buffer.from(base64, 'base64');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public', 'STUSH_SECONDARY.mp4');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, bytes);

if (bytes.length < 50000) {
  throw new Error(`Secondary film reconstruction failed: ${bytes.length} bytes`);
}

console.log(`Built ${output} (${bytes.length} bytes)`);
