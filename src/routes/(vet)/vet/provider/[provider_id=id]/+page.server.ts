import { providerCompleteRegisterSchema } from '$lib/schemas/providerSchema';
import { workingHourSchema } from '$lib/schemas/workingHourSchema';
import { prisma } from '$lib/server/prisma';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { defaultValues, message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';


const initialFormData = {
    workingHour: [defaultValues(workingHourSchema)]
};

export const load = (async ({ params, url }) => {

    const form = await superValidate(
        initialFormData,
        providerCompleteRegisterSchema,
        { errors: false }
    );

    const oldProvider = await prisma.dogServiceProvider.findUnique({
        where: {
            id: params.provider_id
        },
        select: {
            type: true,
            email: true,
            areas: true,
            firstname: true,
            lastname: true,
            description: true
        }
    });

    if (!oldProvider) {
        throw error(404, 'No se encontró el proveedor que buscabas');
    }

    form.data.type = oldProvider.type;
    form.data.email = oldProvider.email;
    form.data.areas = oldProvider.areas;
    form.data.firstname = oldProvider.firstname;
    form.data.lastname = oldProvider.lastname;
    form.data.description = oldProvider.description!;

    return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
    update: async ({ request, locals, params, url }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, providerCompleteRegisterSchema);
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

            const newProvider = await prisma.dogServiceProvider.update({
                where: {
                    id: params.provider_id
                },
                data: {
                    type: form.data.type,
                    email: form.data.email,
                    areas: form.data.areas,
                    firstname: form.data.firstname,
                    lastname: form.data.lastname,
                    description: form.data.description,
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


        return message(form, "Proveedor creado de forma exitosa!");

    },
    delete: async ({ request, locals, params, url }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, providerCompleteRegisterSchema);
        try {

            const deleted = await prisma.dogServiceProvider.delete({
                where: {
                    id: params.provider_id
                }
            });

        }
        catch (error) {
            console.error(error);
            return message(form, { error: "Eliminación fallida" });
        }
        throw redirect(300, "/vet/provider");
    }

};
