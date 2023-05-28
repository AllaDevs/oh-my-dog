import { prisma } from '$lib/server/prisma';
import { AppointmentState } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const appointmentIdSchema = z.object(
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
    const formData = await request.formData();
    const data = appointmentIdSchema.safeParse(formData.get('appointmentId'));
    if(!data.success) return fail(400, {error: 'No appointment id'});
    const appointment = await prisma.appointment.update({
        where: {
            id: data.data.appointmentId
        },
        data: {
            state: AppointmentState.CONFIRMED
        }
    });

    // Send confirmation email to client¬
    // Change appointment status to confirmed
    //appointment.state = AppointmentState.CONFIRMED;

},
reject: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const data = appointmentIdSchema.safeParse(formData.get('appointmentId'));
    if(!data.success) return fail(400, {error: 'No appointment id'});
    const appointment = await prisma.appointment.update({
        where: {
            id: data.data.appointmentId
        },
        data: {
            state: AppointmentState.VET_REJECTED
        }
    });

    // Send confirmation email to client
    // Change appointment status to vet rejected
    //appointment.state = AppointmentState.VET_REJECTED;

},
cancel: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const data = appointmentIdSchema.safeParse(formData.get('appointmentId'));
    if(!data.success) return fail(400, {error: 'No appointment id'});
    const appointment = await prisma.appointment.update({
        where: {
            id: data.data.appointmentId
        },
        data: {
            state: AppointmentState.CANCELLED
        }
    });
    // Send cancellation email to client
    // Change appointment status to cancelled

},
complete: async ({ request, locals, url }) => {

    const formData = await request.formData();
    const data = appointmentIdSchema.safeParse(formData.get('appointmentId'));
    if(!data.success) return fail(400, {error: 'No appointment id'});
    const appointment = await prisma.appointment.update({
        where: {
            id: data.data.appointmentId
        },
        data: {
            state: AppointmentState.DONE
        }
    });
    // Change appointment status to done

},
change: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const data = appointmentIdSchema.safeParse(formData.get('appointmentId'));
    if(!data.success) return fail(400, {error: 'No appointment id'});
    const appointment = await prisma.appointment.update({
        where: {
            id: data.data.appointmentId
        },
        data: {
            state: AppointmentState.VET_REQUEST
        }
    });
    // Send change request email to client
    // Change appointment status to vet_request
    
}
};


//     default: async ({ request, locals, url }) => {
//         const { appointment, action } = request.body as {
//             appointment: Appointment;
//             action: string;
//         };
//         const { session, user } = await locals.auth.validateUser();
//         const client = await prisma.client.findUnique({
//             where: {
//                 id: user!.userId
//             },
//             select: {
//                 id: true
//             }
//         });

//         switch (action) {
//             case "confirm": {
//                 // Send confirmation email to client
//                 // Change appointment status to confirmed
                

//                 break;
//             }
//             case "reject": {
//                 // Send rejection email to client
//                 // Change appointment status to rejected
//                 appointment.state = AppointmentState.VET_REJECTED;

//                 break;
//             }
//             case "cancel": {
//                 // Send cancellation email to client
//                 // Change appointment status to cancelled
//                 appointment.state = AppointmentState.CANCELLED;

//                 break;
//             }
//             case "do": {
//                 // Change appointment status to done
//                 // If a new appointment is needed, create it
//                 appointment.state = AppointmentState.DONE;

//                 break;
//             }
//             case "change": {
//                 // Change appointment status to vet_request
//                 // Send email to client
//                 appointment.state = AppointmentState.VET_REQUEST;

//                 break;
//             }
//             default:
//                 return {
//                     status: 400,
//                     body: {
//                         message: 'Invalid appointment change',
//                     },
//                 };
//             // else fail

//     }
// };
