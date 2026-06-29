import { z } from "zod";

/**
 * Auth & onboarding validation schemas.
 * Single source of truth — these will be reused by the backend (API route
 * handlers / server actions) when it lands, so client and server validate
 * against identical rules.
 */

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(60, "Name must be at most 60 characters");

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, "Team name is required")
  .max(60, "Team name must be at most 60 characters");

export const inviteEmailSchema = z.union([z.literal(""), emailSchema]);

export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type Credentials = z.infer<typeof credentialsSchema>;

/**
 * Validate a single value against a schema, returning the first error message
 * (or null when valid). Keeps native-input components free of Zod specifics.
 */
export function validateField<T>(
  schema: z.ZodType<T>,
  value: unknown,
): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? "Invalid");
}
