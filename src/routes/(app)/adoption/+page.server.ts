import { prisma } from '$lib/server/prisma.js';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
    const adoptionPosts = await prisma.adoptionPost.findMany({
        include: {
            tempDog: true,
            publisher: true,
            dog: true,
        }
    }
    );
    return {
        adoptionPosts: adoptionPosts,
    };
}) satisfies PageServerLoad;
