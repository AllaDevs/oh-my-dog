import type { LayoutServerLoad } from './$types';


export const load = (async ({ locals }) => {
    const { user } = await locals.auth.validateUser();

    return { user };
}) satisfies LayoutServerLoad;
