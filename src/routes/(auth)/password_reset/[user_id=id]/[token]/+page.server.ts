import { c } from '$lib/schemas';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { logError } from '$lib/server/utils';
import type { AuthPasswordRecovery } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    password: c.passwordMin8chSchema,
    passwordConfirm: c.passwordMin8chSchema
});


export const load = (async ({ locals, params }) => {
    const [session, form, passwordRecovery] = await Promise.all([
        locals.auth.validate(),
        superValidate(schema),
        prisma.authPasswordRecovery
            .findFirst({
                where: {
                    id: params.user_id,
                    token: params.token
                }
            })
            .catch((e) => {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    return null;
                };
                throw e;
            }
            ) as Promise<AuthPasswordRecovery | null>
    ]);

    if (session) {
        throw redirect(303, '/');
    }

    if (!passwordRecovery) {
        throw error(404, 'El link de recuperación de contraseña no es válido');
    }

    if (passwordRecovery.expiresAt < new Date()) {
        await prisma.authPasswordRecovery.delete({
            where: {
                id: passwordRecovery.id
            }
        });
        throw error(404, 'El link de recuperación de contraseña no es válido');
    }

    return { form };
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request, locals, params }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        if (form.data.password !== form.data.passwordConfirm) {
            return setError(form, 'passwordConfirm', 'Las contraseñas no coinciden');
        }

        let passwordRecovery: AuthPasswordRecovery | null = null;
        try {
            passwordRecovery = await prisma.authPasswordRecovery.findFirst({
                where: {
                    id: params.user_id,
                    token: params.token
                }
            });
        } catch (error) {
            logError('auth', 'Error while finding password recovery by id and token', error);
            return fail(400, { form });
        }

        if (!passwordRecovery) {
            return fail(400, { form });
        }

        try {
            await prisma.authPasswordRecovery.delete({
                where: {
                    id: passwordRecovery.id
                }
            });
            await auth.updateKeyPassword('email', passwordRecovery.email, form.data.password);
            await auth.invalidateAllUserSessions(passwordRecovery.authUserId);
        } catch (error) {
            logError('auth', 'Error while updating password by recovery', error);
            return setError(form, '', 'No se pudo actualizar la contraseña');
        }

        throw redirect(303, '/login');
    }
} satisfies Actions;
