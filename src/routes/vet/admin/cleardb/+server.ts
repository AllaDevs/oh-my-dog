import type { RequestHandler } from './$types';
import { clearDB } from '$lib/server/db';


export const POST: RequestHandler = async () => {
    const success = await clearDB();
    return new Response(success ? 'success' : 'failure', {
        status: success ? 200 : 500,
        headers: {
            'content-type': 'text/plain'
        }
    });
};
