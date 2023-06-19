import { z } from 'zod';
import { c } from './commonSchema';
import { dogRegisterSchema } from './dogSchema';


const clientBaseSchema = z.object({
    username: c.usernameSchema,
    lastname: c.lastnameSchema,
    email: c.emailSchema,
    birthdate: c.birthdateSchema,
    phone: c.phoneSchema,
    dni: c.dniSchema
});


export const clientRegisterSchema = clientBaseSchema;
export type ClientRegisterSchema = typeof clientRegisterSchema;

export const clientUpdateSchema = clientBaseSchema;


export const clientCompleteRegisterSchema = clientRegisterSchema.extend({
    dogs: dogRegisterSchema.array().min(1)
});
export type ClientCompleteRegisterSchema = typeof clientCompleteRegisterSchema;
