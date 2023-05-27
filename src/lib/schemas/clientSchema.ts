import { DogSex, DogSize } from '$lib/enums';
import { z } from 'zod';
import { imageSchema } from './commonSchema';


const clientBaseSchema = z.object({
    username: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    birthdate: z.preprocess((value) => new Date(value as string), z.date()),
    phone: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),
    dni: z.string().regex(/^[0-9]{8}$/).refine((dni) => {
        const number = parseInt(dni);
        return number > 30_000_000 && number < 60_000_000;
    })
});

export const clientRegisterSchema = clientBaseSchema;

export const clientUpdateSchema = clientBaseSchema.merge(z.object({
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
    newPasswordConfirm: z.string().min(8).optional()
}));


export const dogRegisterSchema = z.object({
    name: z.string().min(3),
    size: z.nativeEnum(DogSize),
    birthdate: z.preprocess((value) => new Date(value as string), z.date()),
    sex: z.nativeEnum(DogSex),
    color: z.string().min(3),
    image: imageSchema,
    observation: z.string().min(3).optional(),
    breedId: z.string()
});

export type DogRegisterSchema = typeof dogRegisterSchema;

const clientRegisterDogSchema = z.object({
    dogName: z.string().min(3),
    dogSize: z.nativeEnum(DogSize),
    dogBirthdate: z.date(),
    dogSex: z.nativeEnum(DogSex),
    dogColor: z.string().min(3),
    dogImage: imageSchema,
    dogObservation: z.string().min(3).optional(),
    dogBreedId: z.string()
});

export type ClientRegisterDogSchema = typeof clientRegisterDogSchema;

export const clientCompleteRegisterSchema = clientRegisterSchema.extend({
    dogs: dogRegisterSchema.array().min(1)
});

export type ClientCompleteRegisterSchema = typeof clientCompleteRegisterSchema;
