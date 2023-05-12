import { dev } from '$app/environment';
import { createTransport } from 'nodemailer';
import type SMTPConnection from 'nodemailer/lib/smtp-connection';


type EmailAddress = {
    name: string;
    address: string;
};


const SYSTEM_ADDRESS = {
    name: '¡OhMyDog!' as const,
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
        console.error(error);
    } else {
        console.log(`SMTP server is ready to take system messages at ${CONFIG.host}:${CONFIG.port}`);
    }
});


export async function systemEmail(to: EmailAddress, subject: string, text: string, html: string) {
    const result = await transporter.sendMail({
        from: SYSTEM_ADDRESS,
        to: to,
        subject,
        text,
        html
    });

    return result;
}
