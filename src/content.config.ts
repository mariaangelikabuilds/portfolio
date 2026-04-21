import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
    category: z.enum(['case-study', 'experiment', 'writing']),
    stack: z.array(z.string()),
    year: z.number(),
    timeToShip: z.string(),
    heroImage: z.string().optional(),
    order: z.number(),
    publishedAt: z.date(),
  }),
});

export const collections = { work };
