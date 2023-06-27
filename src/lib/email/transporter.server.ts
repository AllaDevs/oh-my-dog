import { dev } from '$app/environment';
import { logError } from '$lib/server/utils';
import { createTransport } from 'nodemailer';
import type SMTPConnection from 'nodemailer/lib/smtp-connection';


type ErrorCode = "EMAIL_CONNECTION_FAILED" | "EMAIL_UNABLE_TO_SEND" | "EMAIL_OTHER_ERROR";

export class EmailError extends Error {
    static readonly CONNECTION_FAILED = 'EMAIL_CONNECTION_FAILED';
    static readonly UNABLE_TO_SEND = 'EMAIL_UNABLE_TO_SEND';
    static readonly OTHER_ERROR = 'EMAIL_OTHER_ERROR';

    readonly code: ErrorCode;

    constructor(code: ErrorCode, message?: string) {
        super(message);
        this.code = code;
    }
}


type EmailAddress = {
    name: string;
    address: string;
} | string;


const SYSTEM_ADDRESS = {
    name: '¡Oh my dog!' as const,
    address: process.env.SENDGRID_SENDER!
} satisfies EmailAddress;

const CONFIG = (
    dev ?
        {
            host: 'localhost',
            port: 1025,
            auth: {
                user: 'project.1',
                pass: 'secret.1'
            }
        } as const :
        {
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: process.env.SENDGRID_USERNAME!,
                pass: process.env.SENDGRID_PASSWORD!
            }
        } as const
) satisfies SMTPConnection.Options;

const transporter = createTransport(CONFIG);

transporter.verify(function (error, success) {
    if (error) {
        logError('email', 'SMTP server is not ready to take system messages, application keeps running but emails will not be sent', error);
    } else {
        console.info(`SMTP server is ready to take system messages at ${CONFIG.host}:${CONFIG.port}`);
    }
});


export async function systemEmail(to: EmailAddress, subject: string, text: string, html: string) {
    try {
        return await transporter
            .sendMail({
                from: SYSTEM_ADDRESS,
                to: to,
                subject,
                text,
                html
            });
    }
    catch (error) {
        if ((error as Record<string, unknown>)?.code === 'ESOCKET') {
            throw new EmailError(EmailError.CONNECTION_FAILED, 'Connection to SMTP server failed');
        }

        logError('email', 'Unhandled error while sending email', error);
        throw new EmailError(EmailError.OTHER_ERROR, 'A problem occurred while sending the email');
    }
}
