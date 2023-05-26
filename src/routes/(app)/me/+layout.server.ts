import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals, request }) => {
	const { session, user } = await locals.auth.validateUser();
	if (!session) {
		throw redirect(303, '/');
	}

	const client = await prisma.client.findFirst({
		where: {
			userId: user.userId
		}
	});

	return {
		me: client!
	};
}) satisfies LayoutServerLoad;
