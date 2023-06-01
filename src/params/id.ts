import type { ParamMatcher } from '@sveltejs/kit';


/**
 * A matcher for MongoDB ObjectIds
 */
const regex = /^[a-f\d]{24}$/i;

export const match = ((param) => {
    return regex.test(param);
}) satisfies ParamMatcher;
