import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async (event) => {

    const { session, user } = await event.locals.auth.validateUser();

    const client = await prisma.client.findUnique({
        where: {
            userId: user!.userId
        },
        select: {
            id: true
        }
    });

    const clientAppointments = await prisma.appointment.findMany({
        where: {
            clientId: client!.id,
        },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            date: true,
            daytime: true,
            state: true,
            reason: true,
            dogId: true,
            dog: {
                select: {
                    name: true,
                    birthdate: true
                }
            }
        }
    });

    return { clientAppointments };
};


export const actions: Actions = {

};
