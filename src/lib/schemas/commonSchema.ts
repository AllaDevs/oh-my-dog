import z from 'zod';


export const passwordSchema = z.string().min(8);

export const usernameSchema = z.string().min(3);

export const lastnameSchema = z.string().min(3);

export const emailSchema = z.string().email();

export const imageSchema = z.any();

export const birthdateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const phoneSchema = z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);

export const dniSchema = z.string().regex(/^[0-9]{8}$/).refine((dni) => {
    const number = parseInt(dni);
    return number > 30_000_000 && number < 60_000_000;
})


const commonSchema = {
    imageSchema,
    birthdateSchema,
    phoneSchema,
    dniSchema,
    passwordSchema,
    usernameSchema,
    lastnameSchema,
    emailSchema
};

export { commonSchema as c };

export default commonSchema;
