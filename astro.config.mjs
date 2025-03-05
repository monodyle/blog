import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import markdown from './src/lib/markdown'

// https://astro.build/config
export default defineConfig({
  site: 'https://minhle.space',
  prefetch: true,
  integrations: [mdx()],
  markdown,
  vite: {
    plugins: [tailwindcss()],
  },
})
