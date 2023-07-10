import { c } from '$lib/schemas';
import { Lucia, auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { Prisma, Role } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const registerSchema = z.object({
    firstname: c.firstnameSchema,
    lastname: c.lastnameSchema,
    email: c.emailSchema,
    password: c.passwordMin8chSchema
});

const deleteSchema = z.object({
    id: c.moongoIdSchema
});


export const load = (async (event) => {
    const [registerForm, deleteForm, vets] = await Promise.all([
        superValidate(registerSchema),
        superValidate(deleteSchema),
        prisma.vet.findMany(),
    ]);

    return {
        registerForm,
        deleteForm,
        vets,
    };
}) satisfies PageServerLoad;


export const actions = {
    register: async ({ request }) => {
        const form = await superValidate(request, registerSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            await prisma.$transaction(async (prisma) => {
                const vet = await prisma.vet.create({
                    data: {
                        firstname: form.data.firstname,
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

        return { registerForm: form };
    },
    delete: async ({ request }) => {
        const form = await superValidate(request, deleteSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const authId = await prisma.authUser.findUnique({
                where: {
                    userId: form.data.id
                }
            });
            if (!authId) {
                return setError(form, '', 'No auth user found for vet with id: ' + form.data.id);
            }

            await auth.deleteUser(authId.id);

            await prisma.vet.delete({
                where: {
                    id: form.data.id
                }
            });
        } catch (error) {
            console.error("Error creating a vet user:\n", error);
            if (
                error instanceof Prisma.PrismaClientKnownRequestError ||
                error instanceof Lucia.LuciaError
            ) {
                return setError(form, '', 'Authentication/db error occured while deleting the vet');
            }
            return setError(form, '', 'Unknown error occured while deleting the vet');
        }

        return { deleteForm: form };
    },
} satisfies Actions;
