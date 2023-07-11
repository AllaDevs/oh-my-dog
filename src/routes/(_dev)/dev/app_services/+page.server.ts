import { checkAllServices, checkDatabaseService, checkEmailService, checkImageService, getResultOf } from '$lib/server/healthCheck';
import type { Actions, PageServerLoad } from './$types';


export const load = (async () => {
    return {
        services: {
            all: await checkAllServices()
        }
    };
}) satisfies PageServerLoad;


export const actions = {
    checkAll: async ({ request }) => {
        return {
            services: {
                all: await checkAllServices()
            }
        };
    },
    checkDatabase: async ({ request }) => {
        return {
            service : await getResultOf(checkDatabaseService())
        };
    },
    checkEmail: async ({ request }) => {
        return {
            service : await getResultOf(checkEmailService())
        };
    },
    checkImage: async ({ request }) => {
        return {
            service : await getResultOf(checkImageService())
        };
    }
} satisfies Actions;
