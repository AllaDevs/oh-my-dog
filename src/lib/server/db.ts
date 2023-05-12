import { Role } from '@prisma/client';
import { auth } from './lucia';
import { prisma } from './prisma';


type ClearDBResult = {
    success: true;
    clearedModels: number;
} | {
    success: false;
    clearedModels: number;
    errors: unknown[];
};

export async function clearDB() {
    const modelNames = [];
    for (const key of Object.keys(prisma)) {
        const preffix = key[0];
        if (preffix && (preffix === '_' || preffix === '$'))
            continue;
        modelNames.push(key);
    }

    let clearedModels = 0;
    const errors = [];
    for (let i = 0; i < modelNames.length; i += 1) {
        const name = modelNames[i];
        try {
            // @ts-expect-error https://github.com/prisma/docs/issues/451
            await prisma[name].deleteMany();
            clearedModels += 1;
        } catch (e) {
            console.error(`Error while deleting ${name}`);
            errors.push(e);
        }
    }

    return {
        success: clearedModels === modelNames.length,
        clearedModels,
        errors: errors.length ? errors : undefined,
    } as ClearDBResult;
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
