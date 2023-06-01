import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    const client = await prisma.client.findUnique({
        where: {
            id: params.client_id,
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
