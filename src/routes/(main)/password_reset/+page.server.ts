import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { resetPasswordHTML, systemEmail } from '$lib/email';


const schema = z.object({
    email: z.string().email(),
});


export const load = (async (event) => {
    const [session, form] = await Promise.all([
        event.locals.auth.validate(),
        superValidate<typeof schema, true>(schema),
    ]);

    if (session) {
        throw redirect(303, '/');
    }

    return { form };
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ request, locals, url }) => {
        const form = await superValidate<typeof schema, true>(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const user = await prisma.authUser.findUnique({
                where: { email: form.data.email },
            });
            if (!user) {
                return setError(form, 'email', 'Email no registrado');
            }

            const token = await prisma.authPasswordRecovery.findUnique({
                where: { userId: user.id },
            });

            if (token) {
                if (token.expiresAt > new Date()) {
                    return setError(form, 'email', 'Ya se ha enviado un correo de recuperación de contraseña a este email, revisa tu bandeja de entrada');
                }
                await prisma.authPasswordRecovery.delete({
                    where: {
                        id: token.id,
                    },
                });
            }

            const newToken = await prisma.authPasswordRecovery.create({
                data: {
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    email: user.email,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                },
            });

            const resetLink = `${url.origin}/password_reset/${newToken.id}/${newToken.token}`;

            await systemEmail(
                user.email,
                'Recuperación de contraseña',
                `Para recuperar tu contraseña, haz click en el siguiente enlace: ${resetLink}`,
                resetPasswordHTML(resetLink)
            );
        }
        catch (error) {
            console.log(error);
            // TODO: handle errors
        }

        return message(form, true);
    }
} satisfies Actions;
