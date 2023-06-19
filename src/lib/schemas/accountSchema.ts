import { z } from 'zod';
import { c } from './commonSchema';


export const accountBaseSchema = z.object({
    username: c.usernameSchema,
    lastname: c.lastnameSchema,
});

export const accountAuthUpdateSchema = z.object({
    currentEmail: c.emailSchema,
    newEmail: z.optional(c.emailSchema),
    currentPassword: c.passwordSchema,
    newPassword: z.optional(c.passwordSchema),
    newPasswordConfirm: z.optional(c.passwordSchema)
});
export type AccountAuthUpdateSchema = typeof accountAuthUpdateSchema;

export const devAccountSchema = accountBaseSchema;

export const vetAccountSchema = accountBaseSchema;

export const clientAccountSchema = accountBaseSchema.extend({
    dni: c.dniSchema,
    birthdate: c.birthdateSchema,
    phone: c.phoneSchema
});
