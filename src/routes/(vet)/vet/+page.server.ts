import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async (event) => {
    const clients = await prisma.client.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
        },
    });

    return { clients };
};
