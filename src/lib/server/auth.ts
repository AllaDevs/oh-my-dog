import { Role } from '$lib/enums';
import type { accountAuthUpdateSchema } from '$lib/schemas';
import { Lucia, auth } from '$lib/server/lucia';
import type { Validation } from 'sveltekit-superforms';
import { setError } from 'sveltekit-superforms/server';
import { prisma } from './prisma';


export function redirectToLogin(
    eventUrl: URL,
    message: string = 'Debes iniciar sesión para acceder a esta página'
) {
    const redirectTo = eventUrl.pathname + eventUrl.search;
    return `/login?redirect_to=${redirectTo}&message=${encodeURIComponent(message)}`;
}


export async function validateAuthUpdateForm<T extends Validation<typeof accountAuthUpdateSchema>>(sForm: T) {
    if (!sForm.valid) {
        return false;
    }

    const { currentEmail, newEmail, currentPassword, newPassword, newPasswordConfirm } = sForm.data;

    if (!currentPassword) {
        setError(sForm, 'currentPassword', 'Debes ingresar tu contraseña actual para actualizar los datos de autenticacion de tu cuenta');
        return false;
    }

    if (!newEmail && !newPassword && !newPasswordConfirm) {
        setError(sForm, null, 'Debes ingresar un nuevo correo o una nueva contraseña para actualizar tu cuenta');
        return false;
    }

    if (newEmail) {
        if (!currentPassword) {
            setError(sForm, 'currentPassword', 'Debes ingresar tu contraseña actual para cambiar tu correo');
            return false;
        }
        try {
            if (await prisma.authKey.findUnique({
                where: {
                    id: `email:${newEmail}`
                }
            })) {
                setError(sForm, 'newEmail', 'Este correo ya esta en uso');
                return false;
            }
        }
        catch (error) {
            console.error("Error during email verification", error);
            setError(sForm, null, 'Ocurrio un error inesperado durante la validacion del correo');
            return false;
        }
    }

    if (newPassword) {
        if (!newPasswordConfirm) {
            setError(sForm, 'newPasswordConfirm', 'Debes confirmar tu nueva contraseña');
            return false;
        }
        if (newPassword !== newPasswordConfirm) {
            setError(sForm, 'newPasswordConfirm', 'Las contraseñas no coinciden');
            return false;
        }
        if (!currentPassword) {
            setError(sForm, 'currentPassword', 'Debes ingresar tu contraseña actual para cambiar tu contraseña');
            return false;
        }
    }
    else {
        if (!currentPassword && newPasswordConfirm) {
            setError(sForm, 'currentPassword', 'Debes ingresar tu contraseña actual para cambiar tu contraseña');
            return false;
        }
        if (newPasswordConfirm) {
            setError(sForm, 'newPassword', 'Debes ingresar tu nueva contraseña para confirmarla');
            return false;
        }
    }

    try {
        const key = await auth.useKey('email', currentEmail, currentPassword);
    }
    catch (error) {
        if (error instanceof Lucia.LuciaError) {
            if (error.message === "AUTH_INVALID_PASSWORD") {
                setError(sForm, 'currentPassword', 'Contraseña incorrecta');
                return false;
            }
            console.log("lucia error", error);
            setError(sForm, null, 'Ocurrio un error durante la validacion de las credenciales');
            return false;
        }
        console.log("error", error);
        setError(sForm, null, 'Ocurrio un error inesperado durante la validacion de las credenciales');
        return false;
    }

    return true;
}


type User = {
    userId: string;
    authId: string;
};

type AccountRole = typeof Role.CLIENT | typeof Role.VET;

export async function updateAccountAuth<T extends Validation<typeof accountAuthUpdateSchema>>(locals: App.Locals, user: User, sForm: T, rol: AccountRole) {
    const { currentEmail, newEmail, currentPassword, newPassword } = sForm.data as (typeof sForm.data & { currentPassword: string; });

    if (newEmail) {
        try {
            const emailExists = await prisma.authUser.findUnique({
                where: {
                    email: newEmail
                }
            });
            if (emailExists) {
                setError(sForm, 'newEmail', 'Este correo ya esta en uso');
                return false;
            }

            await auth.invalidateAllUserSessions(user.authId);
            await auth.deleteUser(user.authId);
            // WARNING: This could break if the user comes from other table
            await prisma[rol === Role.CLIENT ? 'client' : 'vet' as 'client'].update({
                where: {
                    id: user.userId,
                },
                data: {
                    email: newEmail,
                }
            });
            await auth.createUser({
                primaryKey: {
                    providerId: 'email',
                    providerUserId: newEmail,
                    password: newPassword || currentPassword,
                },
                attributes: {
                    userId: user.userId,
                    role: rol,
                    email: newEmail,
                }
            });
            const key = await auth.useKey('email', newEmail, newPassword || currentPassword);
            const session = await auth.createSession(key.userId);
            locals.auth.setSession(session);
            sForm.data.currentEmail = newEmail;
            sForm.data.newEmail = undefined;
            sForm.data.currentPassword = undefined;
            sForm.data.newPassword = undefined;
            sForm.data.newPasswordConfirm = undefined;
        }
        catch (error) {
            console.log("error during auth EMAIL update", error);
            setError(sForm, null, 'Ocurrio un error inesperado durante la actualizacion de la contraseña');
            return false;
        }
    }
    else if (newPassword) {
        try {
            await auth.updateKeyPassword('email', currentEmail, newPassword);
            await auth.invalidateAllUserSessions(user!.authId);
            const key = await auth.useKey('email', currentEmail, newPassword);
            const session = await auth.createSession(key.userId);
            locals.auth.setSession(session);
            sForm.data.currentPassword = undefined;
            sForm.data.newPassword = undefined;
            sForm.data.newPasswordConfirm = undefined;
        }
        catch (error) {
            console.log("error during auth PASSWORD update only", error);
            setError(sForm, null, 'Ocurrio un error inesperado durante la actualizacion de la contraseña');
            return false;
        }
    }

    return true;
}
