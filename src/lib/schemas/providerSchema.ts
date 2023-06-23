import { DogServiceType } from '@prisma/client';
import { z } from 'zod';
import { workingHourSchema } from './workingHourSchema';


const providerBaseSchema = z.object({
    type: z.nativeEnum(DogServiceType),
    email: z.string().email(),
    areas: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    description: z.string().max(280).optional()
});


export const providerRegisterSchema = providerBaseSchema;
export type ProviderRegisterSchema = typeof providerRegisterSchema;

export const providerUpdaterSchema = providerBaseSchema;


export const providerCompleteRegisterSchema = providerRegisterSchema.extend({
    workingHour: workingHourSchema.array().min(1)
});
export type ProviderCompleteRegisterSchema = typeof providerCompleteRegisterSchema;
