import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { prisma } from '$lib/server/prisma';
import { validateWorkingHours } from '$lib/utils/functions';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ params }) => {

    const subsidiary = await prisma.subsidiary.findUnique({
        where: {
            id: params.subsidiary_id
        },
        include: {
            workingHour: true
        }
    });
    if (!subsidiary) {
        throw error(404, 'No se encontró el proveedor que buscabas');
    }

    // subsidiary.location = `(${subsidiary.location.latitude}, ${subsidiary.location.longitude})` as any;
    for (const workingHour of subsidiary.workingHour) {
        workingHour.start = `${workingHour.start.getHours().toString().padStart(2, '0')}:${workingHour.start.getMinutes().toString().padStart(2, '0')}` as unknown as Date;
        workingHour.end = `${workingHour.end.getHours().toString().padStart(2, '0')}:${workingHour.end.getMinutes().toString().padStart(2, '0')}` as unknown as Date;
    }

    const form = await superValidate(
        subsidiary as any,
        subsidiaryCompleteRegisterSchema
    );

    return {
        form,
        subsidiary
    };
}) satisfies PageServerLoad;


export const actions = {
    update: async ({ request, params }) => {
        const form = await superValidate(request, subsidiaryCompleteRegisterSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        // const workingHours = [];
        // for (let i = 0; i < form.data.workingHour.length; i++) {
        //     const workingHour = form.data.workingHour[i];
        //     let startHour = new Date("2000-1-1"); startHour.setHours(Number(workingHour.start.split(":")[0]), Number(workingHour.start.split(":")[1]));
        //     let endHour = new Date("2000-1-1"); endHour.setHours(Number(workingHour.end.split(":")[0]), Number(workingHour.end.split(":")[1]));
        //     if (startHour >= endHour) {
        //         setError(form, `workingHour[${i}].end`, 'La hora de fin debe ser mayor a la hora de inicio');
        //         continue;
        //     }

        //     let invalid = false;
        //     for (let vi = 0; vi < workingHours.length; vi++) {
        //         const vwh = workingHours[vi];
        //         if (vwh.start < startHour && vwh.end > startHour) {
        //             setError(form, `workingHour[${i}].start`, 'La hora de inicio se cruza con otro horario');
        //             continue;
        //         }
        //     }
        //     if (invalid) {
        //         continue;
        //     }

        //     workingHours.push(
        //         {
        //             day: workingHour.day,
        //             start: startHour,
        //             end: endHour
        //         });
        // };
        const workingHours = validateWorkingHours(form.data.workingHour, form, (i) => `workingHour[${i}]`);
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const newProvider = await prisma.subsidiary.update({
                where: {
                    id: params.subsidiary_id
                },
                data: {
                    name: form.data.name,
                    address: form.data.address,
                    location: { latitude: parseFloat(form.data.location.split(", ")[0]), longitude: parseFloat(form.data.location.split(", ")[1]) },
                    workingHour: {
                        create: workingHours
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
            return message(form, "Creación fallida", { status: 400 });
        };

        throw redirect(300, "/vet/subsidiary");
    },
    delete: async ({ request, params }) => {
        const form = await superValidate(request, subsidiaryCompleteRegisterSchema);

        try {
            const deleted = await prisma.subsidiary.delete({
                where: {
                    id: params.subsidiary_id
                }
            });

        }
        catch (error) {
            console.error(error);
            return fail(400, { form });
        }

        throw redirect(303, '/vet/subsidiary');;
    }

} satisfies Actions;
