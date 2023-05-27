import { Role } from '$lib/enums';
import { accountAuthUpdateSchema, vetAccountSchema } from '$lib/schemas';
import { Lucia, auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { defaultData, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


const initialFormData = defaultData(accountAuthUpdateSchema);

export const load = (async ({ locals }) => {
    const { session, user } = await locals.auth.validateUser();
    const vet = await prisma.vet.findUnique({
        where: {
            id: user!.userId
        },
        select: {
            username: true,
            lastname: true
        }
    });

    const accountForm = await superValidate(
        vet!,
        vetAccountSchema,
        { id: 'accountForm' }
    );
    const accountAuthForm = await superValidate(
        { ...initialFormData, currentEmail: user!.email },
        accountAuthUpdateSchema,
        { id: 'accountAuthForm' }
    );

    return { accountForm, accountAuthForm };
}) satisfies PageServerLoad;


export const actions = {
    authUpdate: async ({ request, locals }) => {
        const { session, user } = await locals.auth.validateUser();
        const accountAuthForm = await superValidate(request, accountAuthUpdateSchema, { id: 'accountAuthForm' });
        if (!accountAuthForm.valid) {
            console.error(accountAuthForm);
            return fail(400, { accountAuthForm });
        }

        const { currentEmail, newEmail, currentPassword, newPassword, newPasswordConfirm } = accountAuthForm.data;
        if (!newEmail && !newPassword && !newPasswordConfirm) {
            return setError(accountAuthForm, null, 'Debes ingresar un nuevo correo o una nueva contraseña para actualizar tu cuenta');
        }
        if (newEmail) {
            if (!currentPassword) {
                setError(accountAuthForm, 'currentPassword', 'Debes ingresar tu contraseña actual para cambiar tu correo');
            }
            try {
                if (await prisma.authKey.findUnique({
                    where: {
                        id: `email:${newEmail}`
                    }
                })) {
                    setError(accountAuthForm, 'newEmail', 'Este correo ya esta en uso');
                }
            }
            catch (error) {
                console.error("Error during email verification", error);
                setError(accountAuthForm, null, 'Ocurrio un error inesperado durante la validacion del correo');
            }
            if (!accountAuthForm.valid) {
                return fail(400, { accountAuthForm });
            }
        }
        if (newPassword) {
            if (!newPasswordConfirm) {
                return setError(accountAuthForm, 'newPasswordConfirm', 'Debes confirmar tu nueva contraseña');
            }
            if (newPassword !== newPasswordConfirm) {
                return setError(accountAuthForm, 'newPasswordConfirm', 'Las contraseñas no coinciden');
            }
            if (!currentPassword) {
                return setError(accountAuthForm, 'currentPassword', 'Debes ingresar tu contraseña actual para cambiar tu contraseña');
            }
        }
        else {
            if (!currentPassword && newPasswordConfirm) {
                return setError(accountAuthForm, 'currentPassword', 'Debes ingresar tu contraseña actual para cambiar tu contraseña');
            }
            if (newPasswordConfirm) {
                return setError(accountAuthForm, 'newPassword', 'Debes ingresar tu nueva contraseña para confirmarla');
            }
        }

        if (currentPassword) {
            try {
                const key = await auth.useKey('email', currentEmail, currentPassword);
            }
            catch (error) {
                if (error instanceof Lucia.LuciaError) {
                    if (error.message === "AUTH_INVALID_PASSWORD") {
                        return setError(accountAuthForm, 'currentPassword', 'Contraseña incorrecta');
                    }
                    console.log("lucia error", error);
                    return setError(accountAuthForm, null, 'Ocurrio un error durante la validacion de las credenciales');
                }
                console.log("error", error);
                return setError(accountAuthForm, null, 'Ocurrio un error inesperado durante la validacion de las credenciales');
            }
            if (newEmail) {
                try {
                    const emailExists = await prisma.authUser.findUnique({
                        where: {
                            email: newEmail
                        }
                    });
                    if (emailExists) {
                        return setError(accountAuthForm, 'newEmail', 'Este correo ya esta en uso');
                    }
                    await auth.invalidateAllUserSessions(user!.authId);
                    await auth.deleteUser(user!.authId);
                    await prisma.vet.update({
                        where: {
                            email: currentEmail
                        },
                        data: {
                            email: newEmail,
                        }
                    });
                    const authUser = await auth.createUser({
                        primaryKey: {
                            providerId: 'email',
                            providerUserId: newEmail,
                            password: newPassword || currentPassword,
                        },
                        attributes: {
                            userId: user!.userId,
                            role: Role.VET,
                            email: newEmail,
                        }
                    });
                    const key = await auth.useKey('email', newEmail, newPassword || currentPassword);
                    const session = await auth.createSession(key.userId);
                    locals.auth.setSession(session);
                    accountAuthForm.data.currentEmail = newEmail;
                    accountAuthForm.data.newEmail = undefined;
                    accountAuthForm.data.currentPassword = undefined;
                    accountAuthForm.data.newPassword = undefined;
                    accountAuthForm.data.newPasswordConfirm = undefined;
                }
                catch (error) {
                    console.log("error during auuth", error);
                }
            }
            else if (newPassword) {
                try {
                    await auth.updateKeyPassword('email', currentEmail, newPassword);
                    await auth.invalidateAllUserSessions(user!.authId);
                    const key = await auth.useKey('email', currentEmail, newPassword);
                    const session = await auth.createSession(key.userId);
                    locals.auth.setSession(session);
                    accountAuthForm.data.currentPassword = undefined;
                    accountAuthForm.data.newPassword = undefined;
                    accountAuthForm.data.newPasswordConfirm = undefined;
                }
                catch (error) {
                    console.log("error during PASSWORD update only", error);
                    return setError(accountAuthForm, null, 'Ocurrio un error inesperado durante la actualizacion de la contraseña');
                }
            }
        }

        return { accountAuthForm };
    }
} satisfies Actions;
