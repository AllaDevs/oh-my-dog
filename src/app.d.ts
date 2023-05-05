import type { PrismaClient } from '@prisma/client';

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            auth: import("lucia-auth").AuthRequest;
        }
        // interface PageData {}
        // interface Platform {}
    }

    var __prisma: PrismaClient;

    /// <reference types="lucia-auth" />
    namespace Lucia {
        type Auth = import("$lib/lucia").Auth;
        type UserAttributes = {
            role: import("@prisma/client").Role;
            email: string;
            name: string;
        };
    }
}

export { };
