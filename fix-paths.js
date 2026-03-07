import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

async function fixPaths(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await fixPaths(fullPath);
    } else if (entry.name.endsWith('.html')) {
      let content = await readFile(fullPath, 'utf-8');
      
      // Reemplazar rutas absolutas con relativas
      content = content.replace(/href="\/prueba\//g, 'href="./');
      content = content.replace(/src="\/prueba\//g, 'src="./');
      content = content.replace(/href="\/_astro\//g, 'href="./_astro/');
      content = content.replace(/src="\/_astro\//g, 'src="./_astro/');
      content = content.replace(/href="\/images\//g, 'href="./images/');
      content = content.replace(/src="\/images\//g, 'src="./images/');
      content = content.replace(/href="\/academia-dental/g, 'href="./academia-dental');
      content = content.replace(/src="\/academia-dental/g, 'src="./academia-dental');
      content = content.replace(/href="\/logo-/g, 'href="./logo-');
      content = content.replace(/src="\/logo-/g, 'src="./logo-');
      
      await writeFile(fullPath, content, 'utf-8');
      console.log(`Fixed: ${fullPath}`);
    }
  }
}

fixPaths('./dist').then(() => {
  console.log('✅ All paths fixed to relative!');
}).catch(err => {
  console.error('Error fixing paths:', err);
  process.exit(1);
});
