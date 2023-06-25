import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { workingHourSchema } from '$lib/schemas/workingHourSchema';
import { prisma } from '$lib/server/prisma';
import { validateWorkingHours } from '$lib/utils/functions';
import { fail, redirect } from '@sveltejs/kit';
import { defaultValues, message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


const initialFormData = {
    workingHour: [defaultValues(workingHourSchema)]
};


export const load = (async (event) => {

    const form = await superValidate(
        initialFormData,
        subsidiaryCompleteRegisterSchema,
        { errors: false }
    );

    return { form };
}) satisfies PageServerLoad;


export const actions = {
    register: async ({ request }) => {
        const form = await superValidate(request, subsidiaryCompleteRegisterSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        const workingHours = validateWorkingHours(form.data.workingHour, form, (i) => `workingHour[${i}]`);
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
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
} satisfies Actions;
