import { c } from '$lib/schemas';
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    email: c.emailSchema,
    password: c.passwordMin8chSchema
});


export const load = (async (event) => {
    const session = await event.locals.auth.validate();
    if (session) {
        const redirectTo = event.url.searchParams.get('redirect_to');
        if (redirectTo) {
            throw redirect(303, `/${redirectTo.slice(1)}`);
        }
        throw redirect(303, '/');
    }

    const form = await superValidate(schema);

    return { form };
}) satisfies PageServerLoad;


export const actions = {
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
                if (
                    error.message === 'AUTH_INVALID_KEY_ID' ||
                    error.message === 'AUTH_INVALID_PASSWORD'
                ) {
                    return setError(form, 'password', 'Email no registrado o la contraseña no corresponde');
                }
                // if (error.message === 'AUTH_INVALID_KEY_ID') {
                //     return setError(form, 'email', 'Email no registrado');
                // }
                // if (error.message === 'AUTH_INVALID_PASSWORD') {
                //     return setError(form, 'password', 'Contraseña incorrecta');
                // }

                console.error('Unhandled lucia error in loging:\n', error);
                return setError(form, '', `AUTH ${error.message}`);
            }

            console.error('Unhandled error in loging:\n', error);
            return setError(form, '', `UNKNOWN ${(error as Record<string, unknown>).message ?? (error as Record<string, unknown>).code ?? ''}`);
        }

        const redirectTo = url.searchParams.get('redirect_to');
        if (redirectTo) {
            throw redirect(303, `/${redirectTo.slice(1)}`);
        }
        throw redirect(303, '/');
    }
} satisfies Actions;
