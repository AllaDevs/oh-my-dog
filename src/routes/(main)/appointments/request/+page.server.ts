import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { LuciaError } from 'lucia-auth';
import { dev } from '$app/environment';
import { Daytime, AppointmentReason, AppointmentState } from '$lib/enums';
import { prisma } from '$lib/server/prisma';

const schema = z.object({
    date: z.date(),
    daytime: z.nativeEnum(Daytime),
    reason: z.nativeEnum(AppointmentReason),
    dogId: z.string()
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

    const clientDogs = await prisma.registeredDog.findMany({
        where: {
            ownerId: client!.id,
        },
        select: {
            id: true,
            name: true,
            birthdate: true,
        }
    });

    const form = await superValidate(schema);

    return { form, clientDogs };
};


export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        const { session, user } = await locals.auth.validateUser();
        const client = await prisma.client.findUnique({
            where: {
                userId: user!.userId
            },
            select: {
                id: true
            }
        });
        const dog = await prisma.registeredDog.findUnique({
            where: {
                id: form.data.dogId
            },
            select: {
                id: true,
                birthdate: true
            }
        });

        // if the dog is younger than 4 months and the reason is antirabic, the appointment is not valid
        if (form.data.reason === AppointmentReason.ANTIRABIC &&
            dog!.birthdate > new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 4)) {
            return setError(form, null, `El perro debe tener al menos 4 meses para recibir la vacuna antirrábica`);
        }

        try {
            const appointment = await prisma.appointment.create({
                data: {
                    date: form.data.date,
                    daytime: form.data.daytime,
                    state: AppointmentState.CLIENT_REQUEST,
                    reason: form.data.reason,
                    client: {
                        connect: {
                            id: client!.id
                        }
                    },
                    dog: {
                        connect: {
                            id: dog!.id
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
            return message(form, "Pedido de turno fallido!", { status: 400 });
        };

        return message(form, "Pedido de turno exitoso!");
    }
};
