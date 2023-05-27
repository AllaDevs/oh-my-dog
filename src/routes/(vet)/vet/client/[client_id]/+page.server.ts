import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { clientRegisterSchema } from '$lib/schemas/clientSchema';


export const load = (async ({ locals, params, url }) => {
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

	const form = superValidate(client, clientRegisterSchema);

	return { client, editable, form };
}) satisfies PageServerLoad;

export const actions = {
	update: async ({}) => {}
} satisfies Actions;
