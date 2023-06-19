import { cancelledAppoinmentHTML, confirmedAppoinmentHTML, rejectedAppoinmentHTML, systemEmail } from '$lib/email';
import { prisma } from '$lib/server/prisma';
import { prettyDate } from '$lib/utils/functions';
import { te } from '$lib/utils/translateEnums';
import { AppointmentState } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    appointmentId: z.string()
});

const recordSchema = z.object({
    appointmentId: z.string(),
    observation: z.string()
});


export const load: PageServerLoad = async (event) => {
    let appointments = await prisma.appointment.findMany({
        select: {
            id: true,
            createdAt: true,
            date: true,
            daytime: true,
            state: true,
            reason: true,
            dogId: true,
            dog: {
                select: {
                    id: true,
                    name: true,
                    birthdate: true
                }
            },
            client: {
                select: {
                    email: true
                }
            }
        }
    });

    const clients = await prisma.client.findMany({
        select: {
            id: true,
            email: true
        }
    });

    return { appointments, clients };
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
        await systemEmail(
            { name: appointment.client.username, address: appointment.client.email },
            'Turno aceptado!',
            `Hola ${appointment.client.username}. Queríamos informarte que tu pedido de turno para el día ${prettyDate(appointment.date)} ha sido confirmado!
            Te esperamos a la ${te.Daytime(appointment.daytime)}.`,
            confirmedAppoinmentHTML(appointment.client.username, prettyDate(appointment.date), te.Daytime(appointment.daytime))
        );
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
                state: AppointmentState.VET_REJECTED
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

        // Send confirmation email to client
        // Change appointment status to vet rejected
        await systemEmail(
            { name: appointment.client.username, address: appointment.client.email },
            'Turno rechazado',
            `Hola ${appointment.client.username}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${prettyDate(appointment.date)} a la ${te.Daytime(appointment.daytime)}, el mismo ha sido rechazado.
            Por favor pedí un turno para una nueva fecha y nos pondremos en contacto!`,
            rejectedAppoinmentHTML(appointment.client.username, prettyDate(appointment.date), te.Daytime(appointment.daytime))
        );

    },
    cancel: async ({ request, locals, url }) => {
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
                state: AppointmentState.CANCELLED
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
        await systemEmail(
            { name: appointment.client.username, address: appointment.client.email },
            'Turno cancelado',
            `Hola ${appointment.client.username}. Queríamos informarte que lamentablemente hemos tenido que cancelar tu turno para el ${prettyDate(appointment.date)} a la ${te.Daytime(appointment.daytime)}.
            Por favor pedí un nuevo turno y nos pondremos en contacto!`,
            cancelledAppoinmentHTML(appointment.client.username, prettyDate(appointment.date), te.Daytime(appointment.daytime))
        );
    }
};
