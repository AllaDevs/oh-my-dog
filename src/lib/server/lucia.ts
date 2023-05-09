import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import prismaAdapter from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";
import { prisma } from "$lib/server/prisma";


export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: dev ? 'DEV': 'PROD',
  middleware: sveltekit(),
  transformDatabaseUser: (userData) => {
    return {
      usedId: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    }
  }
});

export type Auth = typeof auth;