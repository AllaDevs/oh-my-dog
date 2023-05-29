import { Role } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';


export const load = (async ({ locals }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
        return {
            user: null,
            client: null,
        };
    }

    const client = await prisma[user.role === Role.CLIENT ? 'client' : 'admin' as "client"].findUnique({
        where: {
            id: user.userId,
        }
    });

    return {
        user: {
            userId: user.userId,
            email: user.email,
            role: user.role,
        },
        client
    };
}) satisfies LayoutServerLoad;
