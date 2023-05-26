import { auth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const POST = (async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) {
        throw redirect(303, '/');
    }

    await auth.invalidateSession(session.sessionId);
    locals.auth.setSession(null);

    throw redirect(303, '/login');
}) satisfies RequestHandler;
