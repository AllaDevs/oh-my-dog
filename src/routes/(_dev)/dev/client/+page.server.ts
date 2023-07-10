import { c, clientRegisterSchema } from '$lib/schemas';
import { Lucia, auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { Prisma, Role } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


const schema = clientRegisterSchema.extend({
    password: c.passwordMin8chSchema
});


export const load = (async (event) => {
    const [form, clients] = await Promise.all([
        superValidate(schema),
        prisma.client.findMany(),
    ]);

    return { form, clients };
}) satisfies PageServerLoad;


export const actions = {
    register: async ({ request }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            await prisma.$transaction(async (prisma) => {
                const client = await prisma.client.create({
                    data: {
                        firstname: form.data.firstname,
                        lastname: form.data.lastname,
                        email: form.data.email,
                        phone: form.data.phone,
                        birthdate: new Date(form.data.birthdate),
                        dni: form.data.dni,
                    }
                });

                const authUser = await auth.createUser({
                    primaryKey: {
                        providerId: 'email',
                        providerUserId: form.data.email,
                        password: form.data.password
                    },
                    attributes: {
                        userId: client.id,
                        role: Role.CLIENT,
                        email: client.email
                    }
                });
            });
        } catch (error) {
            console.error("Error creating a vet user:\n", error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError ||
                error instanceof Lucia.LuciaError
            ) {
                return setError(form, '', 'Authentication/db error occured while creating the vet');
            }
            return setError(form, '', 'Unknown error occured while creating the vet');
        }

        return { form };
    }
} satisfies Actions;
