import { z } from 'zod';
import { c } from './commonSchema';


const subsidiaryBaseSchema = z.object({
    name: c.onlyWordSequenceSchema,
    address: z.string().nonempty(),
    workHours: z.string().nonempty(),
});

export const subsidiaryRegisterSchema = subsidiaryBaseSchema.extend({
    location: z.string(),
});
export type SubsidiaryRegisterSchema = typeof subsidiaryRegisterSchema;

export const subsidiaryCompleteRegisterSchema = subsidiaryBaseSchema.extend({
    autocompletedAddress: z.string().nonempty(),
    location: z.string(),
});
export type SubsidiaryCompleteRegisterSchema = typeof subsidiaryCompleteRegisterSchema;

export const subsidiaryUpdateSchema = subsidiaryBaseSchema.extend({
    autocompletedAddress: z.string().nonempty(),
    location: z.string(),
});
export type SubsidiaryUpdateSchema = typeof subsidiaryUpdateSchema;
