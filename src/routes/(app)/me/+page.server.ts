import { AppointmentState } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event));
    }

    const [dogs, appointments, donations] = await Promise.all([
        prisma.registeredDog.findMany({
            where: {
                ownerId: user.userId
            },
            select: {
                id: true,
                name: true,
                image: true,
            }
        }),
        prisma.appointment.findMany({
            where: {
                clientId: user.userId,
                state: {
                    notIn: [AppointmentState.CANCELLED, AppointmentState.CLIENT_REJECTED, AppointmentState.VET_REJECTED, AppointmentState.DONE]
                }
            },
            include: {
                dog: {
                    select: {
                        name: true,
                        id: true,
                        image: true,
                    }
                }
            }
        }),
        prisma.donation.findMany({
            where: {
                clientId : user.userId,
            }
        })
    ]);

    return {
        dogs: dogs,
        appointments: appointments,
        donations: donations
    };
}) satisfies PageServerLoad;
