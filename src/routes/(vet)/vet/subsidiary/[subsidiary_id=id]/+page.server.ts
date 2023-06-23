import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { workingHourSchema } from '$lib/schemas/workingHourSchema';
import { prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { defaultValues, message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

const initialFormData = {
    workingHour: [defaultValues(workingHourSchema)]
};

export const load = (async ({ params, url }) => {

    const form = await superValidate(
        initialFormData,
        subsidiaryCompleteRegisterSchema,
        { errors: false }
    );

    const oldSubsidiary = await prisma.subsidiary.findUnique({
        where: {
            id: params.subsidiary_id
        },
        select: {
            name: true,
            address: true,
            location: true,
        }
    });

    if (!oldSubsidiary) {
        throw error(404, 'No se encontró el proveedor que buscabas');
    }

    form.data.name = oldSubsidiary.name;
    form.data.address = oldSubsidiary.address;

    return { form, oldSubsidiary };
}) satisfies PageServerLoad;

export const actions: Actions = {
    update: async ({ request, locals, params, url }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, subsidiaryCompleteRegisterSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        try {

            const workingHours = [];
            for (const workingHour of form.data.workingHour) {
                let startHour = new Date("2000-1-1"); startHour.setHours(Number(workingHour.start.split(":")[0]), Number(workingHour.start.split(":")[1]));
                let endHour = new Date("2000-1-1"); endHour.setHours(Number(workingHour.end.split(":")[0]), Number(workingHour.end.split(":")[1]));
                workingHours.push(
                    {
                        day: workingHour.day,
                        start: startHour,
                        end: endHour
                    });
            };

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
    delete: async ({ request, locals, params, url }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, subsidiaryCompleteRegisterSchema);
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

};
