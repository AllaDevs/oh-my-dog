import { redirectToLogin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load = (async ({ locals, url }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
        throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para poner en adopción un perro'));
    }

    const campaigns = await prisma.donationCampaign.findMany();

    return {
        campaigns
    };
}) satisfies PageServerLoad;
