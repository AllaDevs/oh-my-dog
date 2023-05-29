import { prisma } from '$lib/server/prisma';
import { AppointmentState } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { systemEmail } from '$lib/email';
import {dayTimeMapper} from '$lib/utils/mappers';
const schema = z.object(
    {
        appointmentId: z.string()
    })
    

export const load: PageServerLoad = async (event) => {
    const appointments = await prisma.appointment.findMany({
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
                    id: true,
                    name: true,
                    birthdate: true
                }
            }
        }
    });

    return { appointments };
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
            }
        });
        // Send confirmation email to client
        // Change appointment status to confirmed
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
            'Turno aceptado!',
            `Hola ${client.username}. Queríamos informarte que tu pedido de turno para el día ${appointment.date.toLocaleDateString()} ha sido confirmado!
Te esperamos a la ${dayTimeMapper(appointment.daytime)}.`
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
            }
        });

        // Send confirmation email to client
        // Change appointment status to vet rejected
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
            'Turno rechazado',
            `Hola ${client.username}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${appointment.date.toLocaleDateString()} a la ${dayTimeMapper(appointment.daytime)}, el mismo ha sido rechazado.
Por favor pedí un turno para una nueva fecha y nos pondremos en contacto!`
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
            }
        });
        // Send cancellation email to client
        // Change appointment status to cancelled
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
            'Turno cancelado',
            `Hola ${client.username}. Queríamos informarte que lamentablemente hemos tenido que cancelar tu turno para el ${appointment.date.toLocaleDateString()} a la ${dayTimeMapper(appointment.daytime)}.
Por favor pedí un nuevo turno y nos pondremos en contacto!`
        );
    },
    complete: async ({ request, locals, url }) => {
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
                state: AppointmentState.DONE
            }
        });
        // Change appointment status to done
    },
};
