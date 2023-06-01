import { clientRegisterSchema } from '$lib/schemas/clientSchema';
import { prisma } from '$lib/server/prisma';
import { mutateToShortString } from '$lib/utils/functions';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ params, url }) => {
    const client = await prisma.client.findUnique({
        where: {
            id: params.client_id
        },
        include: {
            dog: true,
            donation: true,
            appointment: true
        }
    });
    if (!client) {
        throw error(404, 'Client not found');
    }

    const editable = url.searchParams.get('editable') === 'true';

    const form = superValidate(mutateToShortString(client, 'birthdate'), clientRegisterSchema);

    return { client, editable, form };
}) satisfies PageServerLoad;

export const actions = {
    update: async ({ }) => { }
} satisfies Actions;
