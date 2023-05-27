import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load = (async ({ locals, request }) => {
    const { session, user } = await locals.auth.validateUser();
    if (!session) {
        throw redirect(303, '/');
    }

    const dogs = await prisma.registeredDog.findMany({
        where: {
            ownerId: user.userId
        },
        select: {
            id: true,
            name: true,
            image: true,
        }
    });

    return {
        dogs: dogs
    };
}) satisfies PageServerLoad;
