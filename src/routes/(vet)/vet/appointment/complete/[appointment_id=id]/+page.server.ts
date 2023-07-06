import { autoProgramedAppointmentHTML, systemEmail } from '$lib/email';
import { AppointmentReason, AppointmentState } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { friendlyDateARG } from '$lib/utils/functions';
import { error, fail, redirect } from '@sveltejs/kit';
import { addDays, addYears, isAfter, subMonths } from 'date-fns';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    appointmentId: z.string(),
    observation: z.string()
});


export const load = (async ({ params }) => {
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: params.appointment_id
        },
        include: {
            client: {
                select: {
                    id: true,
                    firstname: true
                }
            }
        }
    });
    if (!appointment) {
        throw error(404, 'Appointment not found');
    }
    if (appointment.state !== AppointmentState.CONFIRMED) {
        throw error(404, 'Appointment not valid');
    }

    const form = await superValidate(schema);

    return { form, appointment };
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request, locals, params }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        const appointment = await prisma.appointment.update({
            where: {
                id: params.appointment_id
            },
            data: {
                state: AppointmentState.DONE
            },
            include: {
                dog: {
                    select: {
                        id: true,
                        name: true,
                        birthdate: true,
                    }
                },
                client: {
                    select: {
                        firstname: true,
                        email: true,
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

        // Si el turno es para vacuna:
        // - Si tiene menos de cuatro meses, se da un turno dentro de 21 días exacto
        // - Sino se da un turno dentro de un año exacto
        // Se notifica al cliente por mail
        if (appointment.reason === AppointmentReason.VACCINE) {
            const today = new Date();
            const fourMonthsAgo = subMonths(today, 4);
            const newAppointmentDate = (
                isAfter(appointment.dog.birthdate, fourMonthsAgo)
                    ? addDays(today, 21)
                    : addYears(today, 1)
            );

            const newAppointment = await prisma.appointment.create({
                data: {
                    date: newAppointmentDate,
                    daytime: appointment.daytime,
                    reason: AppointmentReason.VACCINE,
                    state: AppointmentState.CONFIRMED,
                    dogId: appointment.dogId,
                    clientId: appointment.clientId
                }
            });

            await systemEmail(
                {
                    name: appointment.client.firstname,
                    address: appointment.client.email
                },
                'Turno auto programado',
                `Se ha programado un turno de vacuna para ${appointment.dog.name} el día ${friendlyDateARG(newAppointment.date)} a la ${newAppointment.daytime}.`,
                autoProgramedAppointmentHTML(appointment.client.firstname, appointment.dog.name, appointment.reason, friendlyDateARG(newAppointment.date).split(',')[0], newAppointment.daytime)
            );
        }

        throw redirect(303, '/vet/appointment');
    }
} satisfies Actions;
