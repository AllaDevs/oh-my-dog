import { AppointmentReason, AppointmentState, Daytime } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { systemEmail } from '$lib/email';

const schema = z.object({
    date: z.date(),
    daytime: z.nativeEnum(Daytime),
    message: z.string()
});

export const load: PageServerLoad = async (locals, params) => {
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: params.appointmentId
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
    if(appointment.state != AppointmentState.CLIENT_REQUEST){
        return fail(404, { error: 'Appointment not valid' });
    }

    const form = await superValidate(schema);

    return { form, appointment };
};


export const actions: Actions = {
    default: async ({ request, locals, params, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        // can´t be same day and same daytime
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: params.appointmentId,
            },
            select: {
                date: true,
                daytime: true
            }
        });
        if(appointment.date == data.data.date && appointment.daytime == data.data.daytime){
            return message(form, "No puede solicitarse un cambio para el mismo día en el mismo horario!", { status: 400 });

        const appointment = await prisma.appointment.update({
            where: {
                id: form.data.appointmentId
            },
            data: {
                state: AppointmentState.VET_REQUEST,
                date: form.data.date,
                daytime: form.data.daytime
            }
        });
        // Send change request email to client
        // Change appointment status to vet_request
        const client = await prisma.client.findUnique({
            where: {
                id: appointment.clientId
            },
            select: {
                username: true,
                email: true
            }
        });
        await systemEmail(
            { name: client.username, address: client.email },
            'Propuesta de cambio',
            `Hola ${client.username}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${appointment.date.toLocaleDateString()} a la ${dayTimeMapper(appointment.daytime)}.
Se ha generado una propuesta de cambio para el día ${form.data.date.toLocaleDateString()} a la ${dayTimeMapper(form.data.daytime)}, por favor, ingresa a tu cuenta para aceptarla o rechazarla.`
        );
    }
}
}
