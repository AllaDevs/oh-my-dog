import { Day } from '@prisma/client';
import { z } from 'zod';

const schema = z.object({
    day: z.nativeEnum(Day),
    start: z.string(),
    end: z.string()
});

export const workingHourSchema = schema;
export type WorkingHourSchema = typeof workingHourSchema;
