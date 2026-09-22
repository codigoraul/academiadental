import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// El sitio se sirve desde la raíz (academiadental.cl/) tanto en local como en
// producción. Si alguna vez hay que desplegar en una subcarpeta, basta con
// pasar BASE_PATH=/subcarpeta/ al build (ej. en GitHub Actions).
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  base: process.env.BASE_PATH || '/',
});
