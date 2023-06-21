import { clientUpdateSchema } from '$lib/schemas/clientSchema';
import { redirectToLogin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { mutateToShortString } from '$lib/utils/functions';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ params, url }) => {
    const client = await prisma.client.findUnique({
        where: {
            id: params.client_id
        },
        include: {
            dog: true,
            donation: {
                include: {
                    campaign: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            appointment: true
        }
    });
    if (!client) {
        throw error(404, 'No se encontró el cliente que quieres administrar');
    }

    const updateForm = await superValidate(mutateToShortString(client, 'birthdate'), clientUpdateSchema, { id: 'update' });

    return { client, updateForm };
}) satisfies PageServerLoad;


export const actions = {
    update: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para actualizar un cliente'));
        }

        const form = await superValidate(request, clientUpdateSchema, { id: 'update' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const client = await prisma.client.update({
                where: {
                    id: params.client_id
                },
                data: {
                    firstname: form.data.firstname,
                    lastname: form.data.lastname,
                    birthdate: new Date(form.data.birthdate),
                    phone: form.data.phone,
                    dni: form.data.dni
                }
            });
            if (!client) {
                throw error(404, 'No se encontro el cliente que quieres actualizar');
            }
        }
        catch (err) {
            console.error(err);
            //TODO: handle update errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        return { updateForm: form };
    },
} satisfies Actions;
