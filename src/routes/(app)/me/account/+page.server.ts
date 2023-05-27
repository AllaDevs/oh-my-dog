import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { Role } from '$lib/enums';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { prisma } from '$lib/server/prisma';
import { LuciaError, generateRandomString } from 'lucia-auth';
import { systemEmail, newAccountHTML } from '$lib/email';

const schema = z.object({
    username: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    birthdate: z.date(),
    phone: z.string().regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/),
    password: z.string().min(8).optional(),
    passwordConfirm: z.string().min(8).optional(),
    dni: z.string().min(8)
});

export const load = (async ({ locals }) => {
    const form = await superValidate(schema);

    return { form };
}) satisfies PageServerLoad;

export const actions = {
    client: async ({ request }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        let success = false;
        let clientId = '';
        try {
            success = await prisma.$transaction(async (prisma) => {
                const client = await prisma.client.create({
                    data: {
                        username: form.data.username,
                        lastname: form.data.lastname,
                        email: form.data.email,
                        birthdate: form.data.birthdate,
                        phone: form.data.phone,
                        dni: form.data.dni
                    }
                });
                clientId = client.id;
                const generatedPassword = generateRandomString(10);
                const user = await auth.createUser({
                    primaryKey: {
                        providerId: 'email',
                        providerUserId: form.data.email,
                        password: generatedPassword
                    },
                    attributes: {
                        userId: client.id,
                        role: Role.CLIENT,
                        email: form.data.email
                    }
                });

                await systemEmail(
                    { name: form.data.username, address: form.data.email },
                    'Cuenta creada en ¡OhMyDog!',
                    `Bienvenido ${form.data.username} a OhMyDog!. Tu contraseña es: ${generatedPassword}, puedes cambiarla en tu perfil.`,
                    newAccountHTML(form.data.username, form.data.lastname, generatedPassword)
                );

                return true;
            });
        } catch (error) {
            if (error instanceof LuciaError) {
                return setError(form, null, error.message);
            }
            console.error(error);
            return fail(400, { message: 'Failed to create user' });
        }

        if (!success) {
            return fail(400, { message: 'Failed to create user' });
        }
        throw redirect(303, `/vet/register/${clientId}`);
    }
} satisfies Actions;
