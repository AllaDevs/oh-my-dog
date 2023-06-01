import { DogSex, DogSize } from '$lib/enums';
import { z } from 'zod';
import { c } from './commonSchema';


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


export const dogRegisterSchema = z.object({
    name: z.string().min(3),
    size: z.nativeEnum(DogSize),
    birthdate: z.preprocess((value) => new Date(value as string), z.date()),
    sex: z.nativeEnum(DogSex),
    color: z.string().min(3),
    image: c.imageSchema,
    observation: z.string().min(3).optional(),
    breedId: z.string()
});

export type DogRegisterSchema = typeof dogRegisterSchema;


export const clientCompleteRegisterSchema = clientRegisterSchema.extend({
    dogs: dogRegisterSchema.array().min(1)
});

export type ClientCompleteRegisterSchema = typeof clientCompleteRegisterSchema;
