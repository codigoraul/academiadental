import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Local: sin base (localhost:4321/). En el deploy, GitHub Actions pasa
// BASE_PATH=/prueba/ para que el sitio funcione en esa subcarpeta.
export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  base: process.env.BASE_PATH || '/',
});
