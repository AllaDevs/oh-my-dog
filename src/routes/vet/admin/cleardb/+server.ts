import type { RequestHandler } from './$types';
import { clearDB } from '$lib/server/db';


export const POST: RequestHandler = async () => {
    const result = await clearDB();
    return new Response(result.success ? 'success' : 'failure', {
        status: result.success  ? 200 : 500,
        headers: {
            'content-type': 'text/plain'
        }
    });
};
