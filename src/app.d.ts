import type { PrismaClient } from '@prisma/client';

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            auth: import('lucia-auth').AuthRequest;
        }
        // interface PageData {}
        // interface Platform {}
    }

    var __prisma: PrismaClient;

    /// <reference types='lucia-auth' />
    namespace Lucia {
        type Auth = import('$lib/server/lucia').Auth;
        type UserAttributes = Omit<import('@prisma/client').AuthUser, 'id'>;
        type User = import('lucia-auth').User;
    }
}

export { };
