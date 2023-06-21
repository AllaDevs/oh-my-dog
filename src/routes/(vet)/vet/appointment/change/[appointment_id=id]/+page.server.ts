import { changedAppoinmentHTML, systemEmail } from '$lib/email';
import { AppointmentState, Daytime } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { prettyDate } from '$lib/utils/functions';
import { te } from '$lib/utils/translateEnums';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    date: z.date(),
    daytime: z.nativeEnum(Daytime),
    message: z.string()
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
                    firstname: true
                }
            }
        }
    });

    if (!appointment) {
        throw error(404, 'Appointment not found');
    }
    if (appointment.state != AppointmentState.CLIENT_REQUEST) {
        throw error(404, 'Appointment not valid');
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
        // can´t be same day and same daytime
        let oldAppointment = await prisma.appointment.findUnique({
            where: {
                id: params.appointment_id,
            },
            select: {
                id: true,
                date: true,
                daytime: true
            }
        });
        if (!oldAppointment) return message(form, "Turno no encontrado", { status: 404 });

        if ((oldAppointment.date === form.data.date) && (oldAppointment.daytime === form.data.daytime)) {
            return message(form, "No puede solicitarse un cambio para el mismo día en el mismo horario!", { status: 400 });
        };

        let newAppointment = await prisma.appointment.update({
            where: {
                id: oldAppointment.id
            },
            data: {
                state: AppointmentState.VET_REQUEST,
                date: form.data.date,
                daytime: form.data.daytime
            },
            select: {
                date: true,
                daytime: true,
                client: {
                    select: {
                        id: true,
                        firstname: true,
                        email: true
                    }
                }
            }
        });
        // Send change request email to client
        // Change appointment status to vet_request
        await systemEmail(
            { name: newAppointment.client.firstname, address: newAppointment.client.email },
            'Propuesta de cambio',
            `Hola ${newAppointment.client.firstname}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${prettyDate(newAppointment.date)} a la ${te.Daytime(newAppointment.daytime)}.
            Se ha generado una propuesta de cambio para el día ${prettyDate(form.data.date)} a la ${te.Daytime(form.data.daytime)}, por favor, ingresa a tu cuenta para aceptarla o rechazarla.`,
            changedAppoinmentHTML(newAppointment.client.firstname, prettyDate(newAppointment.date), te.Daytime(newAppointment.daytime), prettyDate(form.data.date), te.Daytime(form.data.daytime), form.data.message)
        );

        throw redirect(303, '/vet/appointment');
    }
};
