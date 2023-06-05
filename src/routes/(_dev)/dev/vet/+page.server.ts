import { Lucia, auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { Prisma, Role } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    username: z.string().min(3),
    lastname: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8)
});


export const load = (async (event) => {
    const form = await superValidate(schema);
    const vets = await prisma.vet.findMany();

    return { form, vets };
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        let success = false;
        try {
            success = await prisma.$transaction(async (prisma) => {
                const vet = await prisma.vet.create({
                    data: {
                        username: form.data.username,
                        lastname: form.data.lastname,
                        email: form.data.email
                    }
                });

                const authUser = await auth.createUser({
                    primaryKey: {
                        providerId: 'email',
                        providerUserId: form.data.email,
                        password: form.data.password
                    },
                    attributes: {
                        userId: vet.id,
                        role: Role.VET,
                        email: vet.email
                    }
                });


                return true;
            });
        } catch (error) {
            console.error("Error creating a vet user:\n", error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError ||
                error instanceof Lucia.LuciaError
            ) {
                return setError(form, null, 'Authentication/db error occured while creating the vet');
            }
            return setError(form, null, 'Unknown error occured while creating the vet');
        }

        return { form };
    }
} satisfies Actions;
