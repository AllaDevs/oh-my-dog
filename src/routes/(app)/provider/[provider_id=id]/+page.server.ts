import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

export const load = (async (event) => {
    const provider = await prisma.dogServiceProvider.findUnique({
        where: {
            id: event.params.provider_id
        },
        select: {
            type: true,
            email: true,
            areas: true,
            username: true,
            lastname: true,
            description: true
        }
    });

    if (!provider) {
        throw error(404, 'No se encontró el proveedor que buscabas');
    }

    return { provider };
}) satisfies PageServerLoad;

export const actions: Actions = {
    contact: async ({ request, locals, params, url }) => {
        const user = await locals.auth.validateUser();
        // send emails to both user and provider with contact data
    }
};
