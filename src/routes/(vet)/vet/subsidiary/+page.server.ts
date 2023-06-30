import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';


export const load = (async ({ params, url }) => {

    const subsidiaries = await prisma.subsidiary.findMany({
        select: {
            id: true,
            location: true,
            address: true,
            name: true,
            workHours: true,
            // phone: true
        }
    });

    return { subsidiaries };
}) satisfies PageServerLoad;
