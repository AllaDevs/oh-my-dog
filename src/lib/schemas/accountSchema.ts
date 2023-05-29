import { z } from 'zod';


export const accountBaseSchema = z.object({
    username: z.string().min(3),
    lastname: z.string().min(3),
});

export const accountAuthUpdateSchema = z.object({
    currentEmail: z.string().email(),
    newEmail: z.string().email().optional(),
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
    newPasswordConfirm: z.string().min(8).optional()
});

export const devAccountSchema = accountBaseSchema;

export const vetAccountSchema = accountBaseSchema;

export const clientAccountSchema = accountBaseSchema.extend({
    dni: z.string().min(8),
    birthdate: z.date(),
    phone: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
});
