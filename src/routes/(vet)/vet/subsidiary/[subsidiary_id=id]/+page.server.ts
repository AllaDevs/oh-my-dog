import { subsidiaryCompleteRegisterSchema } from '$lib/schemas/subsidiarySchema';
import { prisma } from '$lib/server/prisma';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async ({ params }) => {
    const subsidiary = await prisma.subsidiary.findUnique({
        where: {
            id: params.subsidiary_id
        }
    });
    if (!subsidiary) {
        throw error(404, 'No se encontró la sucursal que buscabas');
    }

    const form = await superValidate(
        {
            ...subsidiary,
            autocompletedAddress: subsidiary.location.autocompletedAddress,
            location: `${subsidiary.location.latitude}, ${subsidiary.location.longitude}`
        },
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

        try {
            const [latitude, longitude] = form.data.location.replaceAll(/[()]/g, '').split(",");

            const subsidiary = await prisma.subsidiary.update({
                where: {
                    id: params.subsidiary_id
                },
                data: {
                    name: form.data.name,
                    address: form.data.address,
                    location: {
                        update: {
                            autocompletedAddress: form.data.autocompletedAddress,
                            latitude: Number(latitude.trim()),
                            longitude: Number(longitude.trim()),
                        }
                    },
                    workHours: form.data.workHours
                }
            });
        }
        catch (error) {
            console.error(error);
            return setError(form, '', 'Error al actualizar la sucursal');
        };

        throw redirect(300, "/vet/subsidiary");
    },
    delete: async ({ request, params }) => {
        const form = await superValidate(request, subsidiaryCompleteRegisterSchema);

        try {
            const subsidiary = await prisma.subsidiary.delete({
                where: {
                    id: params.subsidiary_id
                }
            });

        }
        catch (error) {
            console.error(error);
            return fail(400);
        }

        throw redirect(303, '/vet/subsidiary');;
    }
} satisfies Actions;
