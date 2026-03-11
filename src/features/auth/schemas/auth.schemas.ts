import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerStep1Schema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(100, 'Username must be less than 100 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const registerStep2Schema = z.object({
  display_name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(255, 'Display name is too long'),
  avatar: z.instanceof(File).optional().nullable(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.new_password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
