import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const _date = z.string().or(z.date())
const _baseSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  date: _date,
})

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: _baseSchema.extend({
    image: z.string().optional(),
  }),
})

const til = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/til' }),
  schema: _baseSchema,
})

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: _baseSchema,
})

export const collections = { blog, til, notes }
