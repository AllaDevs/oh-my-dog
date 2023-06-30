import { systemEmail } from '$lib/email';
import { Role } from '@prisma/client';
import { auth } from './lucia';
import { prisma } from './prisma';


export function logError(source: string, message: string, error: unknown) {
    console.error(`[${source}] ${message}\n`, error);
}


export async function logToEmail(reciverName: string, reciverEmail: string, logReason: string, data: unknown, logToConsole = true) {
    let sData;
    try {
        sData = JSON.stringify(data, null, 2);
    }
    catch (error) {
        logError('Internal', 'Error at stringifying data at logToEmail', error);
        sData = "Error at stringifying data at logToEmail";
    }

    if (logToConsole) {
        logError('LogToEmail', logReason, sData);
    }

    await systemEmail(
        {
            name: reciverName,
            address: reciverEmail
        },
        logReason,
        sData,
        `<p>${sData}</p>`
    );
}


export async function registerAdmin(name: string, password: string) {
    try {
        const finalEmail = `${name}@a.com`;
        const admin = await prisma.admin.create({
            data: {
                firstname: name,
                lastname: name + ' lastname',
                email: finalEmail
            }
        });
        const user = await auth.createUser({
            primaryKey: {
                providerId: 'email',
                providerUserId: finalEmail,
                password: password
            },
            attributes: {
                userId: admin.id,
                role: Role.ADMIN,
                email: finalEmail
            }
        });
        console.info("Success at creating admin account: ", name);
        return true;
    }
    catch (error) {
        logError('Register Admin', 'Error at creating an admin account', error);
        return false;
    }
}


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
            logError('ClearDB', `Error while deleting ${name}`, e);
            errors.push(e);
        }
    }

    return {
        success: clearedModels === modelNames.length,
        clearedModels,
        errors: errors.length ? errors : undefined
    } as ClearDBResult;
}
