import { z } from 'zod';
import { c } from './commonSchema';
import { workingHourSchema } from './workingHourSchema';


const subsidiaryBaseSchema = z.object({
    name: z.string(),
    location: c.locationSchema,
    address: z.string()
});


export const subsidiaryRegisterSchema = subsidiaryBaseSchema;
export type SubsidiaryRegisterSchema = typeof subsidiaryRegisterSchema;

export const subsidiaryUpdaterSchema = subsidiaryBaseSchema;


export const subsidiaryCompleteRegisterSchema = subsidiaryRegisterSchema.extend({
    workingHour: workingHourSchema.array().min(1)
});
export type SubsidiaryCompleteRegisterSchema = typeof subsidiaryCompleteRegisterSchema;
