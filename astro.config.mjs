import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import markdown from './src/lib/markdown/markdown'

// https://astro.build/config
export default defineConfig({
  site: 'https://minhle.space',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown,
})
