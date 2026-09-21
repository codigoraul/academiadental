/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0876D9',
        secondary: '#0796DF',
        dark: '#121D31',
        light: '#E2EAF2',
        navy: '#0E3A6B',
        steel: '#7895B2',
        base: '#F5F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
