import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from '../$types';


export const load: PageServerLoad = async (event) => {

    const subsidiaries = await prisma.subsidiary.findMany({
        select: {
            id: true,
            location: true,
            address: true,
            workingHour: true,
            // phone: true
        }
    });

    return { subsidiaries };
};
