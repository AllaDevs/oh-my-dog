import { dev } from '$app/environment';
import { createTransport } from 'nodemailer';
import type SMTPConnection from 'nodemailer/lib/smtp-connection';


const SYSTEM_EMAIL = 'noreply@ohmydog.vet';

const config = (
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
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: '',
                pass: ''
            }
        } as const
) satisfies SMTPConnection.Options;


export const transporter = createTransport(config);

transporter.verify(function (error, success) {
    if (error) {
        console.error(error);
    } else {
        console.log(`SMTP server is ready to take system messages at ${config.host}:${config.port}`);
    }
});


type EmailAddress = {
    name: string;
    address: string;
};


export async function systemEmail(to: EmailAddress, subject: string, text: string, html: string) {
    const result = await transporter.sendMail({
        from: SYSTEM_EMAIL,
        to: to,
        subject,
        text,
        html
    });

    return result;
}

export async function userMail(from: EmailAddress, to: EmailAddress, subject: string, text: string, html: string) {
    const result = await transporter.sendMail({
        from: from,
        to: to,
        subject,
        text,
        html
    });

    return result;
}
