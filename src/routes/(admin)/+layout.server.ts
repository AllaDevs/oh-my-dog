import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event, "Debes iniciar sesion en tu cuenta de administrador para continuar"));
    }

    const dev = await prisma.admin.findUnique({
        where: {
            id: user.userId
        }
    });
    if (!dev) {
        throw error(403, 'No eres un administrador');
    }

    return {
        user: {
            userId: user.userId,
            email: user.email,
            role: user.role,
        },
        dev: dev
    };
}) satisfies LayoutServerLoad;
