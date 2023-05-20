import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
    tags: z.array(z.string()).optional(),
		date: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		image: z.string().optional(),
	}),
});

export const collections = { blog };
