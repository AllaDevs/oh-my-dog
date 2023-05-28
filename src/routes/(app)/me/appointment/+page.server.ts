import { prisma } from '$lib/server/prisma';
import { AppointmentState } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const appointmentIdSchema = z.object(
    {
        appointmentId: z.string()
    });

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
    confirm: async ({ request, locals, url }) => {
        const formData = await request.formData();
        const data = appointmentIdSchema.safeParse(formData.get('appointmentId'));
        if (!data.success) return fail(400, { error: 'No appointment id' });
        const appointment = await prisma.appointment.update({
            where: {
                id: data.data.appointmentId
            },
            data: {
                state: AppointmentState.CONFIRMED
            }
        });
    }
};
