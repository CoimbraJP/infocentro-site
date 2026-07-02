// Recomprime as sequencias de frames em public/frames.
// Os originais ficam preservados em /frames-backup (gitignored).
// Uso: node scripts/optimize-frames.mjs
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const SEQUENCES = [
  // hero: original em 8K, mas o canvas desenha no maximo 3840px e a imagem
  // recebe overlay escuro — 2560px de largura e indistinguivel na pratica
  { dir: 'public/frames/loop', width: 2560, quality: 72 },
  // sobre: desenhada num card de ~600px; mantem 1280, so re-encoda
  { dir: 'public/frames/sobre', width: null, quality: 70 },
];

const BACKUP_ROOT = 'frames-backup';

const mb = (bytes) => (bytes / 1048576).toFixed(1) + ' MB';

for (const { dir, width, quality } of SEQUENCES) {
  const name = dir.split('/').pop();
  const backupDir = join(BACKUP_ROOT, name);
  mkdirSync(backupDir, { recursive: true });

  const files = readdirSync(dir).filter((f) => f.endsWith('.webp'));
  let before = 0;
  let after = 0;

  for (const file of files) {
    const src = join(dir, file);
    const bak = join(backupDir, file);
    if (!existsSync(bak)) copyFileSync(src, bak); // idempotente: nunca sobrescreve o backup

    before += statSync(bak).size;
    let pipeline = sharp(bak);
    if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
    await pipeline.webp({ quality, effort: 6 }).toFile(src);
    after += statSync(src).size;
  }

  console.log(`${name}: ${files.length} frames, ${mb(before)} -> ${mb(after)}`);
}
