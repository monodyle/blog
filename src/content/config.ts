import { defineCollection, z } from 'astro:content'

const _date = z.string().or(z.date()).transform((val) => new Date(val))

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).optional(),
    date: _date,
    image: z.string().optional(),
  }),
})

const til = defineCollection({
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()).optional(),
    date: _date,
  }),
})

export const collections = { blog, til }
