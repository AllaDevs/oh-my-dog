import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {

    const form = await superValidate(
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
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            const newSubsidiary = await prisma.subsidiary.create({
                data: {
                    name: form.data.name,
                    location: { latitude: parseFloat(form.data.location.split(", ")[0]), longitude: parseFloat(form.data.location.split(", ")[1]) },
                    address: form.data.address,
                    workHours: form.data.workHours
                }
            });
        }
        catch (error) {
            console.error(error);
            return message(form, "Creación fallida", { status: 400 });
        };

        throw redirect(300, "/vet/subsidiary_old");

    }
} satisfies Actions;
