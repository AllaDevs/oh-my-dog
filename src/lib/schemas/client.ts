import { z } from 'zod';

export const clientSchema = z.object({
    username: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    birthdate: z.date(),
    phone: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
});
