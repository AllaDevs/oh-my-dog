import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

const prisma = globalThis.__prisma || new PrismaClient();

if (dev) {
  globalThis.__prisma = prisma;
}

export { prisma };
