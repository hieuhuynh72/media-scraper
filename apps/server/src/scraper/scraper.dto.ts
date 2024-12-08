import { z } from 'zod';

/**
 * Zod schema to validate input.
 */
export const urlArraySchema = z.object({
  urls: z.array(z.string().url()).max(5000), // Validate that each item is a valid URL
});

export const getMediaQuerySchema = z.object({
  urls: z.array(z.string().url()).max(5000),
  type: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
});

/**
 * TypeScript interface matching the schema.
 */
export type UrlArrayDto = z.infer<typeof urlArraySchema>;
export type GetMediaQueryDto = z.infer<typeof getMediaQuerySchema>;
