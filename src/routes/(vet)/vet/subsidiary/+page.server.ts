import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async (event) => {
    const subsidiaries = await prisma.subsidiary.findMany();

    return {
        subsidiaries
    };
}) satisfies PageServerLoad;
