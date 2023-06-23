import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { workingHourSchema } from '$lib/schemas/workingHourSchema';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { defaultValues, message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

const initialFormData = {
    workingHour: [defaultValues(workingHourSchema)]
};

export const load: PageServerLoad = async (event) => {

    const form = await superValidate(
        initialFormData,
        subsidiaryCompleteRegisterSchema,
        { errors: false }
    );

    return { form };
};

export const actions: Actions = {
    register: async ({ request, locals, url }) => {
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

            console.log(form.data);

            const newProvider = await prisma.subsidiary.create({
                data: {
                    name: form.data.name,
                    location: { latitude: parseFloat(form.data.location.split(", ")[0]), longitude: parseFloat(form.data.location.split(", ")[1]) },
                    address: form.data.address,
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

    }
};
