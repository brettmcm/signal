import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const signals = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/signals" }),
  schema: z.object({
    signalNumber: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("published"),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    canonical: z.url().optional(),
  }),
});

export const collections = { signals };
