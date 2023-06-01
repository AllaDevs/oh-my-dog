import { prisma } from '$lib/server/prisma';
import { AppointmentState } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object(
    {
        appointmentId: z.string()
    });

export const load: PageServerLoad = async (event) => {

    const { session, user } = await event.locals.auth.validateUser();

    const client = await prisma.client.findUnique({
        where: {
            id: user!.userId
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
    confirm: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        const appointment = await prisma.appointment.update({
            where: {
                id: form.data.appointmentId
            },
            data: {
                state: AppointmentState.CONFIRMED
            },
            select: {
                date: true,
                daytime: true,
                client: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
    },
    reject: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        const appointment = await prisma.appointment.update({
            where: {
                id: form.data.appointmentId
            },
            data: {
                state: AppointmentState.CLIENT_REJECTED
            },
            select: {
                date: true,
                daytime: true,
                client: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
    }
};
