import { z } from "zod";
import { c } from './commonSchema';


export const dogRegisterSchema = z.object({
    name: c.dogNameSchema,
    size: c.dogSizeSchema,
    birthdate: c.birthdateSchema,
    sex: c.dogSexSchema,
    color: z.string().min(3),
    image: c.imageSchema,
    observation: z.string().min(3).max(256).optional(),
    breedId: c.moongoIdSchema
});
export type DogRegisterSchema = typeof dogRegisterSchema;

export const dogUpdateSchema = dogRegisterSchema;
export type DogUpdateSchema = typeof dogUpdateSchema;

export const temporalDogRegisterSchema = z.object({
    name: c.dogNameSchema,
    birthdate: c.birthdateSchema,
    size: c.dogSizeSchema, 
    sex: c.dogSexSchema, 
    color: z.string().min(3),
    observation: z.string().min(3).optional(), 
    breedId: c.moongoIdSchema
});
export type TemporalDogRegisterSchema = typeof temporalDogRegisterSchema;

export const adoptionPostUpdateSchema = temporalDogRegisterSchema
