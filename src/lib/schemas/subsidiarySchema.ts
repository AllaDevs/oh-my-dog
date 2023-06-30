import { z } from 'zod';


const subsidiaryBaseSchema = z.object({
    name: z.string(),
    location: z.string(),
    address: z.string(),
    workHours: z.string(),
});


export const subsidiaryRegisterSchema = subsidiaryBaseSchema;
export type SubsidiaryRegisterSchema = typeof subsidiaryRegisterSchema;

export const subsidiaryUpdateSchema = subsidiaryBaseSchema;

export const subsidiaryCompleteRegisterSchema = subsidiaryBaseSchema;
export type SubsidiaryCompleteRegisterSchema = typeof subsidiaryCompleteRegisterSchema;
