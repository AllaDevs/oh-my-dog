import { PostState } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event));
    }

    const dogs = await prisma.registeredDog.findMany({
        where: {
            ownerId: user.userId
        },
        select: {
            id: true,
            name: true,
            image: true,
            archived: true,
        }
    });

    return {
        dogs: dogs,
    };


}) satisfies PageServerLoad;


export const actions = {
    myDog: async ({ request, url, locals }) => {
        const idBaseSchema = z.object({ dogId: z.string() });
        const form = await superValidate(request, idBaseSchema);
        const { user } = await locals.auth.validateUser();
        if (!user) {
            setError(form, null, 'Debes iniciar sesión para registrar un perro');
            return fail(401, { form, message: 'Debes iniciar sesión para registrar un perro' });
        }
        if (!form.valid){
            return fail(400, { form });
        }
        try {
            const adoptionPost = await prisma.adoptionPost.create({
                data: {
                    state: PostState.WAITING,
                    publisher: {
                        connect: {
                            id: user.userId
                        }
                    },
                    dog: {
                        connect: {
                            id: form.data.dogId
                        }
                    },
                    registered: true,
                }
            });
        }
        catch (error) {
            console.log(error);
            return setError(form, null, 'Error al dar en adopcion su perro');
        }
        throw redirect(303, '/adoption');
    }
} satisfies Actions;
