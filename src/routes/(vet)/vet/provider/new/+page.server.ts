import { providerCompleteRegisterSchema } from '$lib/schemas/providerSchema';
import { workingHourSchema } from '$lib/schemas/workingHourSchema';
import { prisma } from '$lib/server/prisma';
import { fail, type Actions } from '@sveltejs/kit';
import { defaultData, message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../$types';

const initialFormData = {
    workingHour: [defaultData(workingHourSchema)]
};

export const load: PageServerLoad = async (event) => {

    const form = await superValidate(
        initialFormData,
        providerCompleteRegisterSchema,
        { errors: false });

    return { form };
};

export const actions: Actions = {
    provider: async ({ request, locals, url }) => {
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

            const newProvider = await prisma.dogServiceProvider.create({
                data: {
                    type: form.data.type,
                    email: form.data.email,
                    areas: form.data.areas,
                    username: form.data.username,
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

    }
};