import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative, dirname } from 'path';

function getRelativePath(fromFile, depth) {
  // Calcular cuántos niveles subir según la profundidad del archivo
  if (depth === 0) return './';
  return '../'.repeat(depth);
}

function getDepth(filePath) {
  // Contar cuántos niveles de profundidad tiene el archivo desde dist/
  const relativePath = filePath.replace(/^\.\/dist\//, '').replace(/^dist\//, '');
  const parts = relativePath.split('/');
  return parts.length - 1; // -1 porque el último elemento es el archivo
}

async function fixPaths(dir, baseDir = './dist') {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await fixPaths(fullPath, baseDir);
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.css')) {
      let content = await readFile(fullPath, 'utf-8');
      const depth = getDepth(fullPath);
      const relativePrefix = getRelativePath(fullPath, depth);
      
      // Reemplazar rutas absolutas con relativas en atributos HTML
      content = content.replace(/href="\/prueba\//g, `href="${relativePrefix}`);
      content = content.replace(/src="\/prueba\//g, `src="${relativePrefix}`);
      content = content.replace(/href="\/_astro\//g, `href="${relativePrefix}_astro/`);
      content = content.replace(/src="\/_astro\//g, `src="${relativePrefix}_astro/`);
      content = content.replace(/href="\/images\//g, `href="${relativePrefix}images/`);
      content = content.replace(/src="\/images\//g, `src="${relativePrefix}images/`);
      content = content.replace(/href="\/academia-dental/g, `href="${relativePrefix}academia-dental`);
      content = content.replace(/src="\/academia-dental/g, `src="${relativePrefix}academia-dental`);
      content = content.replace(/href="\/logo-/g, `href="${relativePrefix}logo-`);
      content = content.replace(/src="\/logo-/g, `src="${relativePrefix}logo-`);
      
      // Reemplazar enlaces de navegación internos (href="/cursos" -> href="./cursos" o href="../cursos")
      content = content.replace(/href="\/cursos"/g, `href="${relativePrefix}cursos"`);
      content = content.replace(/href="\/docentes"/g, `href="${relativePrefix}docentes"`);
      content = content.replace(/href="\/metodologia"/g, `href="${relativePrefix}metodologia"`);
      content = content.replace(/href="\/certificacion"/g, `href="${relativePrefix}certificacion"`);
      content = content.replace(/href="\/contacto"/g, `href="${relativePrefix}contacto"`);
      content = content.replace(/href="\/privacidad"/g, `href="${relativePrefix}privacidad"`);
      content = content.replace(/href="\/terminos"/g, `href="${relativePrefix}terminos"`);
      content = content.replace(/href="\/"([^"])/g, `href="${relativePrefix}$1`); // Otros enlaces que empiecen con /
      
      // Reemplazar rutas en url() con comillas simples
      content = content.replace(/url\('\/images\//g, `url('${relativePrefix}images/`);
      content = content.replace(/url\('\/academia-dental/g, `url('${relativePrefix}academia-dental`);
      content = content.replace(/url\('\/logo-/g, `url('${relativePrefix}logo-`);
      content = content.replace(/url\('\/_astro\//g, `url('${relativePrefix}_astro/`);
      
      // Reemplazar rutas en url() con comillas dobles
      content = content.replace(/url\("\/images\//g, `url("${relativePrefix}images/`);
      content = content.replace(/url\("\/academia-dental/g, `url("${relativePrefix}academia-dental`);
      content = content.replace(/url\("\/logo-/g, `url("${relativePrefix}logo-`);
      content = content.replace(/url\("\/_astro\//g, `url("${relativePrefix}_astro/`);
      
      // Reemplazar rutas en url() sin comillas
      content = content.replace(/url\(\/images\//g, `url(${relativePrefix}images/`);
      content = content.replace(/url\(\/academia-dental/g, `url(${relativePrefix}academia-dental`);
      content = content.replace(/url\(\/logo-/g, `url(${relativePrefix}logo-`);
      content = content.replace(/url\(\/_astro\//g, `url(${relativePrefix}_astro/`);
      
      await writeFile(fullPath, content, 'utf-8');
      console.log(`Fixed (depth ${depth}): ${fullPath}`);
    }
  }
}

fixPaths('./dist').then(() => {
  console.log('✅ All paths fixed to relative!');
}).catch(err => {
  console.error('Error fixing paths:', err);
  process.exit(1);
});
