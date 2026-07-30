import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const signals = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/signals" }),
  schema: z.object({
    signalNumber: z.string().regex(/^\d{3}$/, "Use a three-digit signal number"),
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = { signals };
