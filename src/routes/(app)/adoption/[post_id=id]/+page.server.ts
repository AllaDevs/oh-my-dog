import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event));
    }

    const post = await prisma.adoptionPost.findUnique({
        where: {
            id: event.params.post_id
        },
    });
    if (!post) {
        throw error(404, 'No se encontro el post de adopción');
    }
    if (post.publisherId !== user.userId) {
        throw error(403, 'No tienes permiso para ver este post');
    }

    return {
        post
    };
}) satisfies PageServerLoad;


export const actions = {
    delete: async ({ request, url, locals }) => {
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
    }
} satisfies Actions;
