import { clientUpdateSchema } from '$lib/schemas/clientSchema';
import { prisma } from '$lib/server/prisma';
import { mutateToShortString } from '$lib/utils/functions';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { redirectToLogin } from '$lib/server/auth';
import { dogUpdateSchema } from '$lib/schemas';
import { z } from 'zod';


const archiveDogSchema = z.object({});


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, redirectToLogin(event.url));
    }

    const [dog, breeds] = await prisma.$transaction([
        prisma.registeredDog.findUnique({
            where: {
                id: event.params.dog_id,
            },
            include: {
                breed: true,
                medicalRecord: true,
            }
        }),
        prisma.breed.findMany()
    ]);
    if (!dog) {
        throw error(404, 'No se encontró el perro que quieres administrar');
    }

    dog.observation ??= undefined as any;
    if (dog.image) {
        dog.image = (dog.image.url ?? undefined) as any;
    }

    const [updateForm, archiveForm] = await Promise.all([
        superValidate(mutateToShortString(dog, 'birthdate') as any, dogUpdateSchema , { id: 'update' }),
        superValidate(archiveDogSchema, { id: 'archive' })
    ])

    return {
        dog,
        breeds,
        updateForm,
        archiveForm
    };
}) satisfies PageServerLoad;


export const actions = {
    update: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para actualizar un perro'));
        }

        const form = await superValidate(request, dogUpdateSchema, { id: 'update' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const dog = await prisma.registeredDog.update({
                where: {
                    id: params.dog_id
                },
                data: {
                    name: form.data.name,
                    size: form.data.size,
                    birthdate: new Date(form.data.birthdate),
                    sex: form.data.sex,
                    color: form.data.color,
                    breedId: form.data.breedId,
                    observation: form.data.observation,
                }
            })
            if (!dog) {
                throw error(404, 'No se encontro el perro que quieres actualizar');
            }
        }
        catch (err) {
            console.error(err);
            //TODO: handle update errors
            throw error(500, 'Ocurrio un error al actualizar el perro');
        }

        return { updateForm: form };
    },
    archive: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para archivar un perro'));
        }

        const form = await superValidate(request, archiveDogSchema, { id: 'archive' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            // TODO: delete/update adopion posts?
            const dog = await prisma.registeredDog.update({
                where: {
                    id: params.dog_id
                },
                data: {
                    archived: true
                }
            });
            if (!dog) {
                throw error(404, 'No se encontro el cliente que quieres actualizar');
            }
        }
        catch (err) {
            console.error(err);
            //TODO: handle archive errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        return { archiveForm: form };
    },
} satisfies Actions;
