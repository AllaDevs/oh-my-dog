import { prisma } from '$lib/server/prisma';
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ params, url }) => {

    const subsidiaries = await prisma.subsidiary.findMany({
        select: {
            id: true,
            location: true,
            address: true,
            name: true,
            workingHour: true,
            // phone: true
        }
    });

    return { subsidiaries };
}) satisfies PageServerLoad;

export const actions: Actions = {
    edit: async ({ params }) => {
    },
    delete: async ({ params }) => {
    }
};
