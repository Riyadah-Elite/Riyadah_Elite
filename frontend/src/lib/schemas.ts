import { z } from 'zod';

/**
 * Client-side schemas mirror backend/src/validators/user.validator.ts.
 *
 * The server is still the authority. These exist to catch the obvious mistakes
 * before a request leaves the device and to give each field an inline message.
 */
export const loginSchema = z.object({
  email: z.email({ error: 'Enter a valid email address.' }),
  password: z.string().min(1, { error: 'Password is required.' }),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { error: 'Use at least 3 characters.' })
      .max(30, { error: 'Use 30 characters or fewer.' }),
    email: z.email({ error: 'Enter a valid email address.' }),
    password: z
      .string()
      .min(8, { error: 'Use at least 8 characters.' })
      .max(72, { error: 'Use 72 characters or fewer.' }),
    confirmPassword: z.string().min(1, { error: 'Repeat your password.' }),
    role: z.enum(['USER', 'DEVELOPER', 'ORG']).optional(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

/** Flattens zod issues into the `{ field: message }` shape form inputs want. */
export function toFieldErrors<T extends string>(issues: z.core.$ZodIssue[]): FieldErrors<T> {
  const errors: FieldErrors<T> = {};

  for (const issue of issues) {
    const key = issue.path[0];

    if (typeof key === 'string' && !errors[key as T]) {
      errors[key as T] = issue.message;
    }
  }

  return errors;
}
