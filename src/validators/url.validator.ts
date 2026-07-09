import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.string().trim().url("Enter a valid URL"),
  customAlias: z
    .string()
    .trim()
    .min(3, "Custom alias must be at least 3 characters")
    .max(30, "Custom alias must be 30 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Use only letters, numbers, _ or -")
    .optional(),
  title: z.string().trim().max(100).optional(),
  description: z.string().trim().max(300).optional(),
  expiresAt: z.coerce.date().optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;
