import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const _date = z.string().or(z.date())
const _baseSchema = z.object({
  title: z.string(),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  illustration: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
  date: _date,
})

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: _baseSchema.transform((data) => ({
    ...data,
    type: 'blog',
  })),
})

const til = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/til' }),
  schema: _baseSchema.transform((data) => ({
    ...data,
    type: 'til',
  })),
})

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/notes' }),
  schema: _baseSchema.transform((data) => ({
    ...data,
    type: 'notes',
  })),
})

export const collections = { blog, til, notes }
