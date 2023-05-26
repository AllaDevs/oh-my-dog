import { EmailError, resetPasswordHTML, systemEmail } from '$lib/email';
import { prisma } from '$lib/server/prisma';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const TOKEN_EXPIRATION = 1000 * 60 * 60 * 24; // 1 day

const schema = z.object({
    email: z.string().email()
});

export const load = (async (event) => {
    const session = await event.locals.auth.validate();
    if (session) {
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
            const user = await prisma.authUser.findUnique({
                where: { email: form.data.email }
            });

            if (!user) {
                return setError(form, 'email', 'Email no registrado');
            }

            const token = await prisma.authPasswordRecovery.findUnique({
                where: { userId: user.id }
            });

            if (token) {
                if (token.expiresAt > new Date()) {
                    return setError(
                        form,
                        'email',
                        'Ya se ha enviado un correo de recuperación de contraseña a este email, revisa tu bandeja de entrada'
                    );
                }
                await prisma.authPasswordRecovery.delete({
                    where: {
                        id: token.id
                    }
                });
            }

            const newToken = await prisma.authPasswordRecovery.create({
                data: {
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    email: user.email,
                    expiresAt: new Date(Date.now() + TOKEN_EXPIRATION)
                }
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
            if (error instanceof EmailError) {
                try {
                    await prisma.authPasswordRecovery.delete({
                        where: {
                            email: form.data.email
                        }
                    });
                }
                catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        console.error(`Error deleting password recovery token for email ${form.data.email} during an imcomplete password recovery proccess`, error);
                    }
                    else {
                        throw error;
                    }
                }
                if (error.code === EmailError.CONNECTION_FAILED) {
                    return setError(form, null, 'Ocurrio un error con el servidor de emails, intenta de nuevo más tarde');
                }
                if (error.code === EmailError.UNABLE_TO_SEND) {
                    return setError(form, null, 'No se pudo enviar el correo de recuperación de contraseña, intenta de nuevo más tarde');
                }
                // console.error(JSON.stringify(error, null, 2));
                return setError(form, null, 'Ocurrio un error enviando el correo de recuperación de contraseña, intenta de nuevo más tarde');
            }
            // if (error instanceof Prisma.PrismaClientKnownRequestError) {
            //     console.error(JSON.stringify(error, null, 2));
            //     return setError(form, null, 'Ocurrio un error con la base de datos, intenta de nuevo más tarde');
            // }
            console.error(JSON.stringify(error, null, 2));
            return setError(form, null, 'Ocurrio un error inesperado, intenta de nuevo más tarde');
        }

        return message(form, true);
    }
} satisfies Actions;
