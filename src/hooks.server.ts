import { Role } from '$lib/enums';
import { auth } from '$lib/server/lucia';
import { handleLoginRedirect } from '$lib/utils/functions';
import { redirect, type Handle } from '@sveltejs/kit';


export const handle = (async ({ event, resolve }) => {
    event.locals.auth = auth.handleRequest(event);
    const { session, user } = await event.locals.auth.validateUser();
    const pathname = event.url.pathname;

    if (!(session && user)) {
        if (
            pathname.startsWith('/client') ||
            pathname.startsWith('/vet') ||
            pathname.startsWith('/dev')
        ) {
            throw redirect(302, handleLoginRedirect(event));
        }
    }
    else {
        switch (user.role) {
            case Role.CLIENT: {
                if (
                    pathname.startsWith('/vet') ||
                    pathname.startsWith('/dev')
                ) {
                    throw redirect(303, '/');
                }
                break;
            }
            case Role.VET: {
                if (!pathname.startsWith('/vet') && !pathname.startsWith('/api')) {
                    throw redirect(303, '/vet');
                }
                break;
            }
        }
    }

    const response = await resolve(event);

    return response;
}) satisfies Handle;
