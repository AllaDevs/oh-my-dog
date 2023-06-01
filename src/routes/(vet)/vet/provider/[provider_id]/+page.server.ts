import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
    email: z.string().email(),
    areas: z.string(),
    username: z.string(),
    lastname: z.string(),
    description: z.string()
});

export const load = (async ({ locals, params, url }) => {
    const provider = await prisma.dogServiceProvider.findUnique({
        where: {
            id: params.provider_id
        },
        select: {
            type: true,
            email: true,
            review: true,
            workingHour: true,
            areas: true,
            username: true,
            lastname: true,
            description: true
        }
    });

    if (!provider) {
        throw error(404, 'Provider not found');
    }

    const form = superValidate(schema);

    return { provider, form };

}) satisfies PageServerLoad;

export const actions = {
    update: async ({ request, locals }) => {


    },
    delete: async ({ request, locals }) => {


    }
} satisfies Actions;
