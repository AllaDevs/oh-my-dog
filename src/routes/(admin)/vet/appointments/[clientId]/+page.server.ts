import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals, params }) => {
    const client = await prisma.client.findUnique({
        where: {
            id: params.clientId,
        },
        select: {
            id: true,
            username: true
        }
    });

    if (!client) {
        return fail(404, { error: 'User not found' });
    }

    const clientAppointments = await prisma.appointment.findMany({
        where: {
            clientId: client.id,
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

    return { clientAppointments, client };
}) satisfies PageServerLoad;


export const actions: Actions = {

};
