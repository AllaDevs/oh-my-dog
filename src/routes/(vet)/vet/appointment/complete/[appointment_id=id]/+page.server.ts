import { AppointmentState } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { AppointmentReason } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    appointmentId: z.string(),
    observation: z.string()
});


export const load = (async ({ locals, params, url }) => {
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: params.appointment_id
        },
        select: {
            id: true,
            date: true,
            daytime: true,
            state: true,
            reason: true,
            client: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });

    if (!appointment) {
        return fail(404, { error: 'Appointment not found' });
    }
    if (appointment.state != AppointmentState.CONFIRMED) {
        return fail(404, { error: 'Appointment not valid' });
    }

    const form = await superValidate(schema);

    return { form, appointment };
}) satisfies PageServerLoad;


export const actions: Actions = {
    default: async ({ request, locals, params, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        // Si el turno es para vacuna y tiene menos de cuatro meses, se da un turno dentro de 21 días exacto, creandolo y mandando mail al cliente
        // Si el turno es para vacuna y el perro tiene mas de cuatro meses, se da un turno dentro de un año exacto, creandolo y mandando mail al cliente
        const appointment = await prisma.appointment.update({
            where: {
                id: params.appointment_id
            },
            data: {
                state: AppointmentState.DONE
            },
            select: {
                date: true,
                daytime: true,
                reason: true,
                dogId: true,
                clientId: true,
                dog: {
                    select: {
                        id: true,
                        birthdate: true
                    }
                }
            }
        });

        const record = await prisma.medicalRecord.create({
            data: {
                date: appointment.date,
                reason: appointment.reason,
                observation: form.data.observation,
                dogId: appointment.dog.id
            }
        });

        if (appointment.reason == AppointmentReason.VACCINE) {
            // Si el turno es para vacuna y el perro tiene mas de cuatro meses, se da un turno dentro de un año exacto, creandolo y mandando mail al cliente
            const today = new Date();
            today.setMonth(today.getMonth() - 4);
            let newAppointmentDate: Date;
            if (appointment.dog.birthdate.getTime() > today.getTime()) {
                newAppointmentDate = new Date(appointment.date.getFullYear() + 1, appointment.date.getMonth(), appointment.date.getDate());
            } else {
                newAppointmentDate = new Date(appointment.date.getFullYear(), appointment.date.getMonth(), appointment.date.getDate());
                newAppointmentDate.setDate(newAppointmentDate.getDate() + 21);
            }
            const newAppointment = await prisma.appointment.create({
                data: {
                    date: newAppointmentDate,
                    daytime: appointment.daytime,
                    reason: AppointmentReason.GENERAL_CONSULTATION,
                    state: AppointmentState.CONFIRMED,
                    dogId: appointment.dogId,
                    clientId: appointment.clientId
                }
            });
        }

        throw redirect(303, '/vet/appointment');

    }
};
