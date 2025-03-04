import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import markdown from './src/lib/markdown/markdown'

// https://astro.build/config
export default defineConfig({
  site: 'https://minhle.space',
  integrations: [mdx()],
  markdown,
  vite: {
    plugins: [tailwindcss()],
  },
})
