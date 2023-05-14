import { dev } from '$app/environment';
import { clearDB, registerAdmin } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    if (!dev) {
        return new Response(null, { status: 404 });
    }
    if (request.url.match(/\?clearDB=true/)) {
        await clearDB();
    }
    if (request.url.match(/\?addAdmin=true/)) {
        await registerAdmin();
    }
    return new Response('OK');
};
