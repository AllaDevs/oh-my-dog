import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import lucia, { LuciaError, generateRandomString } from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';


const auth = lucia({
    adapter: prismaAdapter(prisma),
    env: dev ? 'DEV' : 'PROD',
    middleware: sveltekit(),
    transformDatabaseUser: (userData) => {
        return {
            authId: userData.id,
            role: userData.role,
            userId: userData.userId,
            email: userData.email,
        };
    }
});

export { auth };

export type Auth = typeof auth;

export const Lucia = {
    LuciaError: LuciaError,
    generateRandomString: generateRandomString,
};

export type * from 'lucia-auth';
