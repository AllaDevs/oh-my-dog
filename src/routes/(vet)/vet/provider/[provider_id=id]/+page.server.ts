import { providerUpdateSchema } from '$lib/schemas/providerSchema';
import { prisma } from '$lib/server/prisma';
import type { Replace } from '$lib/utils/types';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';


export const load = (async ({ params }) => {
    const provider = await prisma.dogServiceProvider.findUnique({
        where: {
            id: params.provider_id
        }
    });
    if (!provider) {
        throw error(404, 'No se encontró el proveedor que buscabas');
    }

    provider.description ??= undefined as any;
    const form = await superValidate(
        provider as Replace<typeof provider, 'description', string | undefined>,
        providerUpdateSchema,
    );

    return { form };
}) satisfies PageServerLoad;


export const actions = {
    update: async ({ request, params }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, providerUpdateSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const updatedProvider = await prisma.dogServiceProvider.update({
                where: {
                    id: params.provider_id
                },
                data: {
                    type: form.data.type,
                    email: form.data.email,
                    firstname: form.data.firstname,
                    lastname: form.data.lastname,
                    workAreas: form.data.workAreas,
                    workHours: form.data.workHours,
                    description: form.data.description,
                }
            });
        }
        catch (error) {
            console.error(error);
            return message(form, "Creación fallida", { status: 400 });
        };

        throw redirect(300, "/vet/provider");
    },
    delete: async ({ request, params }) => {
        const form = await superValidate(request, providerUpdateSchema);

        try {
            await prisma.dogServiceProvider.delete({
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
} satisfies Actions;
