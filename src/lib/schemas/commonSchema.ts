import { DogSex, DogSize } from '$lib/enums';
import z from 'zod';


export const moongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const passwordSchema = z.string().min(8, `Minimo de 8 caracteres`);

export const passwordMin8chSchema = z.string().min(8, `Deben ser al menos 8 caracteres`);


const wordRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:\[\]]{2,}$/u;

const sequenceOfWordRegex = new RegExp(`^${wordRegex.source}(\\s${wordRegex.source})*$`, 'u');

export const wordSchema = z.string().min(4, `Minimo de 4 caracteres`);

export const onlyWordSequenceSchema = (z
    .string()
    .trim()
    .min(4, `Minimo de 4 caracteres`)
    .refine(
        (u) => sequenceOfWordRegex.test(u),
        `Solo se permiten palabra/s compuesta/s por letras`
    )
);


export const firstnameSchema = onlyWordSequenceSchema;

export const lastnameSchema = onlyWordSequenceSchema;


export const emailSchema = z.string().email(`No es un email valido`);


export const imageSchema = z.any();


export const birthdateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);


export const phoneSchema = z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);


export const dniSchema = (z
    .number()
    .int(`El DNI es un numero entero`)
    .min(30_000_000, `El DNI debe ser mayor a 30.000.000`)
    .max(65_000_000, `El DNI debe ser menor a 60.000.000`)
);


export const dogNameSchema = onlyWordSequenceSchema;


export const dogSizeSchema = z.nativeEnum(DogSize);


export const dogSexSchema = z.nativeEnum(DogSex);


export const contactBaseSchema = z.object({
    firstname: firstnameSchema,
    lastname: lastnameSchema,
    email: emailSchema,
    phone: phoneSchema,
});
export type ContactBaseSchema = typeof contactBaseSchema;

export const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number()
});



const commonSchema = {
    imageSchema,
    birthdateSchema,
    phoneSchema,
    dniSchema,
    passwordSchema,
    passwordMin8chSchema,
    firstnameSchema,
    lastnameSchema,
    emailSchema,
    dogNameSchema,
    dogSizeSchema,
    dogSexSchema,
    moongoIdSchema,
    contactBaseSchema,
    locationSchema
};

export { commonSchema as c };

export default commonSchema;
