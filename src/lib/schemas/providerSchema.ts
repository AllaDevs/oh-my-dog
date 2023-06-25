import { DogServiceType } from '@prisma/client';
import { z } from 'zod';


const providerBaseSchema = z.object({
    type: z.nativeEnum(DogServiceType),
    email: z.string().email(),
    workAreas: z.string(),
    workHours: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    description: z.string().max(280).optional()
});


export const providerRegisterSchema = providerBaseSchema;
export type ProviderRegisterSchema = typeof providerRegisterSchema;

export const providerUpdateSchema = providerBaseSchema;


export const providerCompleteRegisterSchema = providerBaseSchema;
export type ProviderCompleteRegisterSchema = typeof providerCompleteRegisterSchema;
