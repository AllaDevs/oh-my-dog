import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
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

    return {
        me: client!
    };
}) satisfies LayoutServerLoad;
