import { Role } from '@prisma/client';
import { auth } from './lucia';
import { prisma } from './prisma';

export async function clearDB() {
    try {
        await Promise.all([
            prisma.admin.deleteMany(),
            prisma.vet.deleteMany(),
            prisma.client.deleteMany(),
            prisma.authUser.deleteMany(),
            prisma.authKey.deleteMany(),
            prisma.authSession.deleteMany(),
        ]);

        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

export async function registerAdmin(name?: string) {
    try {
        const user = await auth.createUser({
            primaryKey: {
                providerId: 'email',
                providerUserId: `${name ?? 'admin'}@a.com`,
                password: 'adminadmin',
            },
            attributes: {
                role: Role.ADMIN,
                email: `${name ?? 'admin'}@a.com`,
            }
        });

        await prisma.admin.create({
            data: {
                user: {
                    connect: {
                        id: user.userId,
                        email: user.email
                    }
                },
                userId: user.id,
                username: name ?? 'admin username',
                lastname: name ?? 'admin lastname',
                email: user.email,
            }
        });

    }
    catch (e) {
        console.error(e);
        return false;
    }
}
