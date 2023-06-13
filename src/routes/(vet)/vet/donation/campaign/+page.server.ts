import { PostState } from '$lib/enums';
import { c, temporalDogRegisterSchema } from '$lib/schemas';
import { redirectToLogin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { logError } from '$lib/server/utils';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { defaultData, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


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
