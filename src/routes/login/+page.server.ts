import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';


export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth.validate();
    if (session) {
        const redirectTo = event.url.searchParams.get('redirectTo');
        if (redirectTo) {
            throw redirect(302, `/${redirectTo.slice(1)}`);
        }
        throw redirect(302, '/');
    }
};

export const actions: Actions = {
    default: async ({ request, locals, url }) => {
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

        const redirectTo = url.searchParams.get('redirectTo');
        if (redirectTo) {
            throw redirect(302, `/${redirectTo.slice(1)}`);
        }
        throw redirect(302, '/');
    }
};
