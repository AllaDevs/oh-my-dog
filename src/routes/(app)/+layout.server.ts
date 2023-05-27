import { Role } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';


export const load = (async ({ locals }) => {
    const { user } = await locals.auth.validateUser();

    const client = user ? await prisma[user.role === Role.CLIENT ? 'client' : 'admin' as "client"].findUnique({
        where: {
            id: user.userId,
        }
    }) : null;
    console.log(client);
    return { user, client };
}) satisfies LayoutServerLoad;
