import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event));
    }

    const dog = await prisma.registeredDog.findUnique({
        where: {
            id: event.params.dog_id,
        },
        include: {
            breed: true,
            medicalRecord: true,
        }
    });
    if (!dog) {
        throw error(404, 'Perro no encontrado');
    }

    return {
        dog
    };
}) satisfies PageServerLoad;
