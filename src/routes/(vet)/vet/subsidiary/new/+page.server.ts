import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { prisma } from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async (event) => {
    const form = await superValidate(
        subsidiaryCompleteRegisterSchema
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
        
        try {
            const [latitude, longitude] = form.data.location.replaceAll(/[()]/g, '').split(", ");

            const newSubsidiary = await prisma.subsidiary.create({
                data: {
                    name: form.data.name,
                    location: {
                        autocompletedAddress: form.data.autocompletedAddress,
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                    },
                    address: form.data.address,
                    workHours: form.data.workHours
                }
            });
        }
        catch (error) {
            console.error(error);
            return setError(form, '', 'Error al crear la sucursal');
        };

        throw redirect(303, "/vet/subsidiary");
    }
} satisfies Actions;
