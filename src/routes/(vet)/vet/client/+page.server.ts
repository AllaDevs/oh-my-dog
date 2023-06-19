import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async (events) => {
    const clients = await prisma.client.findMany();

    return { clients };
}) satisfies PageServerLoad;
