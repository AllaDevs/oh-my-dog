import { DogServiceType } from '$lib/enums';
import { providerRegisterSchema } from '$lib/schemas/providerSchema';
import { prisma } from '$lib/server/prisma';
import { Prisma } from '@prisma/client';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../$types';


export const load = (async (event) => {
    const form = await superValidate(providerRegisterSchema);

    return { form };
}) satisfies PageServerLoad;


export const actions = {
    provider: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, providerRegisterSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const newProvider = await prisma.dogServiceProvider.create({
                data: {
                    type: form.data.type,
                    email: form.data.email,
                    workAreas: form.data.workAreas,
                    workHours: form.data.workHours,
                    firstname: form.data.firstname,
                    lastname: form.data.lastname,
                    description: form.data.description,
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    if ((error.meta?.target as string[]).includes('email')) {
                        return setError(
                            form,
                            'email',
                            `Ya existe un ${form.data.type === DogServiceType.WALKING ? 'paseador' : 'cuidador'} con este email`
                        );
                    }
                }
                return setError(form, '', 'Error con la base de datos al crear el cliente');
            }

            return message(form, "Creación fallida", { status: 400 });
        };

        throw redirect(303, "/vet/provider");
    }
} satisfies Actions;
