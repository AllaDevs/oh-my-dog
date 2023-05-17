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
});


export const load: PageServerLoad = async ({ locals }) => {
    const form = await superValidate(schema);

    return { form };
};

export const actions: Actions = {
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
                const generatedPassword = generateRandomString(10);
                const user = await auth.createUser({
                    primaryKey: {
                        providerId: 'email',
                        providerUserId: form.data.email,
                        password: generatedPassword,
                    },
                    attributes: {
                        role: Role.CLIENT,
                        email: form.data.email,
                    }
                });
                const client = await prisma.client.create({
                    data: {
                        user: {
                            connect: {
                                id: user.userId,
                                email: user.email
                            }
                        },
                        username: form.data.username,
                        lastname: form.data.lastname,
                        email: form.data.email,
                        birthdate: form.data.birthdate,
                        phone: form.data.phone,
                    }
                });
                clientId = client.id;

                await systemEmail(
                    { name: form.data.username, address: form.data.email },
                    'Cuenta creada en ¡OhMyDog!',
                    `Bienvenido ${form.data.username} a OhMyDog!. Tu contraseña es: ${generatedPassword}, puedes cambiarla en tu perfil.`,
                    newAccountHTML(form.data.username, form.data.lastname, generatedPassword)
                );

                return true;
            });
        }
        catch (error) {
            if (error instanceof LuciaError) {
                return setError(form, null, error.message);
            }
            console.error(error);
            return fail(400, { message: "Failed to create user" });
        }

        if (!success) {
            return fail(400, { message: "Failed to create user" });
        }
        throw redirect(303, `/vet/register/${clientId}`);
    }
};
