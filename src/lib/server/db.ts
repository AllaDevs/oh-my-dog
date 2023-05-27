import { Role } from '@prisma/client';
import { auth } from './lucia';
import { prisma } from './prisma';


type ClearDBResult =
    | {
        success: true;
        clearedModels: number;
    }
    | {
        success: false;
        clearedModels: number;
        errors: unknown[];
    };

export async function clearDB() {
    const modelNames = [];
    for (const key of Object.keys(prisma)) {
        const preffix = key[0];
        if (preffix && (preffix === '_' || preffix === '$')) continue;
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
        errors: errors.length ? errors : undefined
    } as ClearDBResult;
}


export async function registerAdmin(name?: string, password?: string) {
    try {
        const finalEmail = `${name ?? 'a'}@a.com`;
        const finalPassword = password ?? 'adminadmin';
        const finalName = name ?? 'default username';
        const admin = await prisma.admin.create({
            data: {
                username: finalName,
                lastname: name ?? 'default lastname',
                email: finalEmail
            }
        });
        const user = await auth.createUser({
            primaryKey: {
                providerId: 'email',
                providerUserId: finalEmail,
                password: finalPassword
            },
            attributes: {
                userId: admin.id,
                role: Role.ADMIN,
                email: finalEmail
            }
        });
        console.info("Success at creating admin account: ", finalName);
        return true;
    }
    catch (e) {
        console.error("Error at creating admin account:\n",e);
        return false;
    }
}
