import { DogSize } from '$lib/enums';
import { DogSex } from '@prisma/client';
import { z } from "zod";
import { imageSchema } from './commonSchema';

export const adoptionBaseSchema = z.object({
    name: z.string().min(3),
    birthdate: z.date(),
    size: z.nativeEnum(DogSize), 
    sex: z.nativeEnum(DogSex), 
    color: z.string().min(3),
    image: imageSchema.optional(),
    observation: z.string().min(3).optional(), 
    breedId: z.string()
});

