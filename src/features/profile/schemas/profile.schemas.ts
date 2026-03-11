import { z } from 'zod';

export const updateProfileSchema = z.object({
  display_name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(255, 'Display name is too long')
    .optional(),
  status: z.enum(['online', 'away', 'busy', 'offline']).optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
