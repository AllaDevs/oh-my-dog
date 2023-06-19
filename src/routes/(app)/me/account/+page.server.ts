import { Role } from '$lib/enums';
import { accountAuthUpdateSchema } from '$lib/schemas';
import { updateAccountAuth, validateAuthUpdateForm } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect } from '$lib/utils/functions';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event));
    }

    const client = await prisma.client.findUnique({
        where: {
            id: user.userId
        }
    });
    if (!client) {
        throw error(403, 'No eres un veterinario');
    }

    const accountAuthForm = await superValidate(
        { currentEmail: client.email },
        accountAuthUpdateSchema,
        { id: 'accountAuthForm', }
    );

    return { accountAuthForm };
}) satisfies PageServerLoad;


export const actions = {
    authUpdate: async ({ request, locals }) => {
        const { session, user } = await locals.auth.validateUser();
        const accountAuthForm = await superValidate(request, accountAuthUpdateSchema, { id: 'accountAuthForm' });

        await validateAuthUpdateForm(accountAuthForm);
        if (!accountAuthForm.valid) {
            console.error(accountAuthForm);
            return fail(400, { accountAuthForm });
        }

        await updateAccountAuth(locals, user!, accountAuthForm, Role.CLIENT);
        if (!accountAuthForm.valid) {
            console.error(accountAuthForm);
            return fail(400, { accountAuthForm });
        }

        return { accountAuthForm };
    }
} satisfies Actions;
