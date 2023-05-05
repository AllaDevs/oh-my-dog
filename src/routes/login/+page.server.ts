import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();
    if (session) {
        throw redirect(302, '/vet');
    }
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const { email, password } = Object.fromEntries(
            await request.formData(),
        ) as Record<string, string>;

        try {
            const key = await auth.useKey('email', email, password);
            const session = await auth.createSession(key.userId);
            locals.auth.setSession(session);
        }
        catch (error) {
            console.error(error);
            return fail(400, { message: "Failed to login" });
        }

        throw redirect(302, '/');
    }
};
