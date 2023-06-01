import { changedAppoinmentHTML, systemEmail } from '$lib/email';
import { AppointmentState, Daytime } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { te } from '$lib/utils/translateEnums';
import { fail, redirect } from '@sveltejs/kit';
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
                    username: true
                }
            }
        }
    });

    if (!appointment) {
        return fail(404, { error: 'Appointment not found' });
    }
    if (appointment.state != AppointmentState.CLIENT_REQUEST) {
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

        if (oldAppointment.date == form.data.date && oldAppointment.daytime == form.data.daytime) {
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
                        username: true,
                        email: true
                    }
                }
            }
        });
        // Send change request email to client
        // Change appointment status to vet_request
        await systemEmail(
            { name: newAppointment.client.username, address: newAppointment.client.email },
            'Propuesta de cambio',
            `Hola ${newAppointment.client.username}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${newAppointment.date.toLocaleDateString()} a la ${te.Daytime(newAppointment.daytime)}.
            Se ha generado una propuesta de cambio para el día ${form.data.date.toLocaleDateString()} a la ${te.Daytime(form.data.daytime)}, por favor, ingresa a tu cuenta para aceptarla o rechazarla.`,
            changedAppoinmentHTML(newAppointment.client.username, newAppointment.date.toLocaleDateString(), te.Daytime(newAppointment.daytime), form.data.date.toLocaleDateString(), te.Daytime(form.data.daytime), form.data.message)
        );

        throw redirect(303, '/vet/appointment');
    }
};
