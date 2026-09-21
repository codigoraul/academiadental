/**
 * Ajusta rutas absolutas del build para que incluyan la base del deploy.
 *
 * Antes este script convertía todo a rutas RELATIVAS (./ y ../) según la
 * profundidad del archivo. Eso rompía la navegación cuando la URL se visitaba
 * sin barra final: en /prueba/sponsors (sin "/") el navegador resuelve
 * "../sponsors" contra /prueba/ y termina en /sponsors, fuera del subdirectorio.
 *
 * Ahora dejamos rutas ABSOLUTAS con la base (/prueba/...), que funcionan
 * a cualquier profundidad y con o sin barra final.
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const rawBase = process.env.BASE_PATH || '/';
const base = ('/' + rawBase.replace(/^\/+|\/+$/g, '') + '/').replace(/^\/{2,}/, '/');

async function fixPaths(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixPaths(fullPath);
      continue;
    }
    if (!entry.name.endsWith('.html') && !entry.name.endsWith('.css')) continue;

    let content = await readFile(fullPath, 'utf-8');
    const before = content;

    // 1) Rutas relativas heredadas -> absolutas con base (solo HTML; en CSS
    //    las rutas relativas las resuelve el propio archivo y son válidas)
    if (entry.name.endsWith('.html')) {
      content = content.replace(/(href|src)="((?:\.\.\/)+|\.\/)(?!\/)/g, `$1="${base}`);
      content = content.replace(/url\((['"]?)((?:\.\.\/)+|\.\/)(?!\/)/g, `url($1${base}`);
    }

    // 2) Rutas absolutas sin la base -> con base (no tocar // ni la base ya aplicada)
    const escBase = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const needsBase = new RegExp(`(href|src)="/(?!/|${escBase.slice(1)})`, 'g');
    content = content.replace(needsBase, `$1="${base}`);
    const needsBaseUrl = new RegExp(`url\\((['"]?)/(?!/|${escBase.slice(1)})`, 'g');
    content = content.replace(needsBaseUrl, `url($1${base}`);

    if (content !== before) {
      await writeFile(fullPath, content, 'utf-8');
      console.log(`✓ ${fullPath}`);
    }
  }
}

if (base === '/') {
  console.log('ℹ️  BASE_PATH = / — no hay nada que ajustar.');
} else {
  fixPaths('./dist')
    .then(() => console.log(`✅ Rutas absolutas con base ${base}`))
    .catch((err) => {
      console.error('Error fixing paths:', err);
      process.exit(1);
    });
}
