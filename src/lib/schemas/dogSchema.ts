import { z } from "zod";
import { c } from './commonSchema';


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
