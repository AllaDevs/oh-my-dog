import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { LuciaError } from 'lucia-auth';
import { dev } from '$app/environment';
import { AppointmentReason, Daytime } from '@prisma/client';
import { prisma } from '$lib/server/prisma';


const PASSWORD_MIN_LENGTH = dev ? 2 : 8;

const schema = z.object({
    date: z.date(),
    daytime: z.nativeEnum(Daytime),
    reason: z.nativeEnum(AppointmentReason),
    dogId: z.string()
});


export const load: PageServerLoad = async (event) => {
    const { session, user } = await event.locals.auth.validateUser();

    const client = await prisma.client.findUnique({
        where: {
            id: user.userId
        },
        select: {
            id: true
        }
    });

    const clientDogs = await prisma.registeredDog.findMany({
        where: {
            ownerId: client!.id,
        },
        select: {
            id: true,
            name: true
        }
    });

    const form = await superValidate(schema);

    return { form };
};


export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        const redirectTo = url.searchParams.get('redirectTo');
        if (redirectTo) {
            throw redirect(302, `/${redirectTo.slice(1)}`);
        }
        throw redirect(302, '/');
    }
};
