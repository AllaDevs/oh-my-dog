import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';


export const load = (async ({ locals, request }) => {
    const { session, user } = await locals.auth.validateUser();
    if (!session) {
        throw redirect(303, '/');
    }

    const client = await prisma.client.findFirst({
        where: {
            id: user.userId
        },
    });
    if (!client) {
        throw error(403, 'No eres un cliente');
    }

    return {
        me: client
    };
}) satisfies LayoutServerLoad;
