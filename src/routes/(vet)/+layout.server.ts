import { Role } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event, "Debes iniciar sesion en tu cuenta de veterinario para continuar"));
    }

    const vet = await prisma[user.role === Role.VET ? 'vet' : 'admin'].findUnique({
        where: {
            id: user.userId
        }
    });
    if (!vet) {
        throw error(403, 'No eres un veterinario');
    }

    return {
        user: {
            userId: user.userId,
            email: user.email,
            role: user.role,
        },
        vet: vet
    };
}) satisfies LayoutServerLoad;
