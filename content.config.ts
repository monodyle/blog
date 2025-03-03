import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders';

const _date = z.string().or(z.date())

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: _date,
    image: z.string().optional(),
  }),
})

const til = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/til" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: _date,
  }),
})

export const collections = { blog, til }
