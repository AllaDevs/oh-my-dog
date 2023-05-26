import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils/functions';
import { prisma } from '$lib/server/prisma';
import { Role } from '$lib/enums';

export const load = (async (event) => {
    const { session, user } = await event.locals.auth.validateUser();

    if (!session || !user) {
        throw redirect(303, handleLoginRedirect(event, "Debes iniciar sesion en tu cuenta de veterinario para continuar"));
    }

    const vet = await prisma[user.role === Role.VET ? 'vet' : 'admin'].findUnique({
        where: {
            userId: user.userId
        }
    });

    if (!vet) {
        throw error(500, 'No erres un veterinario registrado');
    }

    return { user, vet };
}) satisfies LayoutServerLoad;
