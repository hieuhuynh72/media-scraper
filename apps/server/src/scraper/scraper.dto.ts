import { z } from 'zod';

/**
 * Zod schema to validate input.
 */
export const urlArraySchema = z.object({
  urls: z.array(z.string().url()).max(5000), // Validate that each item is a valid URL
});

/**
 * TypeScript interface matching the schema.
 */
export type UrlArrayDto = z.infer<typeof urlArraySchema>;
