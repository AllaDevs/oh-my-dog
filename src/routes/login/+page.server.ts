import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/lucia';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { LuciaError } from 'lucia-auth';
import { dev } from '$app/environment';


const PASSWORD_MIN_LENGTH = dev ? 2 : 8;

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
});


export const load: PageServerLoad = async (event) => {
    const [session, form] = await Promise.all([
        event.locals.auth.validate(),
        superValidate(schema),
    ]);

    if (session) {
        const redirectTo = event.url.searchParams.get('redirectTo');
        if (redirectTo) {
            throw redirect(302, `/${redirectTo.slice(1)}`);
        }
        throw redirect(302, '/');
    }

    return { form };
};


export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const key = await auth.useKey('email', form.data.email, form.data.password);
            const session = await auth.createSession(key.userId);
            locals.auth.setSession(session);
        }
        catch (error) {
            if (error instanceof LuciaError) {
                if (error.message === 'AUTH_INVALID_KEY_ID') {
                    return setError(form, 'email', 'Email no registrado');
                }
                if (error.message === 'AUTH_INVALID_PASSWORD') {
                    return setError(form, 'password', 'Contraseña incorrecta');
                }

                return setError(form, null, `Error during authentication: ${error.message}`);
            }

            console.error(error);
            return setError(form, null, `Unexpected error during authentication`);
        }

        const redirectTo = url.searchParams.get('redirectTo');
        if (redirectTo) {
            throw redirect(302, `/${redirectTo.slice(1)}`);
        }
        throw redirect(302, '/');
    }
};
