import { cancelledAppoinmentHTML, confirmedAppoinmentHTML, rejectedAppoinmentHTML, systemEmail } from '$lib/email';
import { prisma } from '$lib/server/prisma';
import { dayTimeMapper } from '$lib/utils/mappers';
import { AppointmentReason, AppointmentState } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object(
    {
        appointmentId: z.string()
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
            `Hola ${appointment.client.username}. Queríamos informarte que tu pedido de turno para el día ${appointment.date.toLocaleDateString()} ha sido confirmado!
            Te esperamos a la ${dayTimeMapper(appointment.daytime)}.`,
            confirmedAppoinmentHTML(appointment.client.username, appointment.date.toLocaleDateString(), dayTimeMapper(appointment.daytime))
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
            `Hola ${appointment.client.username}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${appointment.date.toLocaleDateString()} a la ${dayTimeMapper(appointment.daytime)}, el mismo ha sido rechazado.
            Por favor pedí un turno para una nueva fecha y nos pondremos en contacto!`,
            rejectedAppoinmentHTML(appointment.client.username, appointment.date.toLocaleDateString(), dayTimeMapper(appointment.daytime))
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
            `Hola ${appointment.client.username}. Queríamos informarte que lamentablemente hemos tenido que cancelar tu turno para el ${appointment.date.toLocaleDateString()} a la ${dayTimeMapper(appointment.daytime)}.
            Por favor pedí un nuevo turno y nos pondremos en contacto!`,
            cancelledAppoinmentHTML(appointment.client.username, appointment.date.toLocaleDateString(), dayTimeMapper(appointment.daytime))
        );
    },
    complete: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        // Si el turno es para vacuna y tiene menos de cuatro meses, se da un turno dentro de 21 días exacto, creandolo y mandando mail al cliente
        // Si el turno es para vacuna y el perro tiene mas de cuatro meses, se da un turno dentro de un año exacto, creandolo y mandando mail al cliente
        const appointment = await prisma.appointment.update({
            where: {
                id: form.data.appointmentId
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
                        birthdate: true
                    }
                }
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
    }
};
