import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
    const { user } = await locals.auth.validateUser();

    const client = user ? await prisma.client.findUnique({
        where: {
            userId: user.userId,
        }
    }) : null;

    return { user, client };
}) satisfies LayoutServerLoad;
