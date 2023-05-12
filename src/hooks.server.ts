import { auth } from '$lib/server/lucia';
import { handleLoginRedirect } from '$lib/utils/functions';
import { Role } from '@prisma/client';
import { redirect, type Handle } from '@sveltejs/kit';


export const handle: Handle = async ({ event, resolve }) => {
    event.locals.auth = auth.handleRequest(event);
    const { session, user } = await event.locals.auth.validateUser();

    if (event.url.pathname.startsWith('/vet')) {
        if (!session && !user) {
            throw redirect(302, handleLoginRedirect(event));
        }
        if (user.role === Role.CLIENT) {
            throw redirect(302, '/');
        }
        if (event.url.pathname.startsWith('/vet/admin') && user.role !== Role.ADMIN) {
            throw redirect(302, '/vet');
        }
    }
    else {
        if (event.request.method === 'GET' && session && user && user.role === Role.VET) {
            throw redirect(302, '/vet');
        }
    }

    const response = await resolve(event);

    return response;
};
