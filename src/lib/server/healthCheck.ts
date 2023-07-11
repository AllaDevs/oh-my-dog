import { transporter } from '$lib/email';
import { cloudinary } from '$lib/server/cloudinary';
import { prisma } from '$lib/server/prisma';


type RawServiceCheckResult = number;


export async function checkDatabaseService() {
    /*

    Current implementation utilizes the $runCommandRaw method of Prisma Client to test the connection to the database.

    Currently the test is using the native MongoDB ping command:

    https://www.mongodb.com/docs/manual/reference/command/ping/#mongodb-dbcommand-dbcmd.ping

    Other alternative is to use the server status command:

    https://www.mongodb.com/docs/manual/reference/command/serverStatus/

    More on Prisma Client $runCommandRaw method:
    
    https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#raw-queries-with-mongodb
    
    */
    const baseTimestamp = Date.now();

    return new Promise<RawServiceCheckResult>((resolve, reject) => {
        prisma
            .$runCommandRaw({
                ping: 1
            })
            .then((result) => {
                // result: { ok: 1 }
                resolve(Date.now() - baseTimestamp);
            })
            .catch((error) => {
                // error: unknown , at the moment
                reject(error);
            });
    });
}


export async function checkEmailService() {
    /*

    Current implementation utilizes the native nodemailer transport.verify() method to test the connection to the email server.

    Errors could be handled with:

    ```ts
    if ((error as Record<string, unknown>)?.code === 'ESOCKET') {
        return new EmailError(EmailError.CONNECTION_FAILED, 'Connection to SMTP server failed');
    }
    return new EmailError(EmailError.OTHER_ERROR, 'A problem occurred while sending the email');
    ```

    */
    const baseTimestamp = Date.now();

    return new Promise<RawServiceCheckResult>((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error || !success) {
                // error: unknown , at the moment
                return reject(error);
            }
            // success: true
            resolve(Date.now() - baseTimestamp);
        });
    });
}


export async function checkImageService() {
    /*

    Current implementation utilizes the cloudinary.api.ping method to test the connection to the image service.

    https://cloudinary.com/documentation/admin_api#ping

    */
    const baseTimestamp = Date.now();

    return new Promise<RawServiceCheckResult>((resolve, reject) => {
        cloudinary.api.ping((error, result) => {
            if (error || result.status !== 'ok') {
                // error: undefined , is deprecated
                reject(error);
            } else {
                // result: {
                //     status: 'ok',
                //     rate_limit_allowed: 500,
                //     rate_limit_reset_at: 2023-07-11T00:00:00.000Z,    
                //     rate_limit_remaining: 475
                // }
                resolve(Date.now() - baseTimestamp);
            }
        });
    });
}


export function getResultOf(service: Promise<RawServiceCheckResult>) {
    const baseTimestamp = Date.now();

    return service
        .then((result) => {
            return {
                status: 'ok',
                time: Date.now() - baseTimestamp
            } as const;
        })
        .catch((error) => {
            try {
                return {
                    status: 'error',
                    time: Date.now() - baseTimestamp,
                    error: JSON.stringify(error, null, 2)
                } as const;
            }
            catch (error) {
                return {
                    status: 'error',
                    time: Date.now() - baseTimestamp,
                    error: 'Could not stringify error object'
                } as const;
            }
        });
}


export async function checkAllServices() {
    const baseTimestamp = Date.now();

    return Promise
        .all([
            getResultOf(checkDatabaseService()),
            getResultOf(checkEmailService()),
            getResultOf(checkImageService()),
        ])
        .then((results) => {
            return {
                timestamp: baseTimestamp,
                totalTime: Date.now() - baseTimestamp,
                database: results[0],
                email: results[1],
                image: results[2],
            };
        });
}
