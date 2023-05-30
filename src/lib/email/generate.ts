import type { ComponentProps, SvelteComponent } from 'svelte';
import EmailCancelledAppointment from './templates/EmailCancelledAppointment.svelte';
import EmailChangedAppointment from './templates/EmailChangedAppointment.svelte';
import EmailConfirmedAppointment from './templates/EmailConfirmedAppointment.svelte';
import EmailNewAccount from './templates/EmailNewAccount.svelte';
import EmailRejectedAppointment from './templates/EmailRejectedAppointment.svelte';
import EmailResetPassword from './templates/EmailResetPassword.svelte';

type RenderResult = {
    html: string;
    css: {
        code: string;
        map: null;
    };
    head: string;
};

type Renderable<T extends SvelteComponent> = { render(props: ComponentProps<T>): RenderResult; };


export function newAccountHTML(username: string, lastname: string, password: string) {
    const r = (EmailNewAccount as unknown as Renderable<EmailNewAccount>).render({ username, lastname, password });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function resetPasswordHTML(href: string) {
    const r = (EmailResetPassword as unknown as Renderable<EmailResetPassword>).render({ href });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function confirmedAppoinmentHTML(username: string, date: string, daytime: string) {
    const r = (EmailConfirmedAppointment as unknown as Renderable<EmailConfirmedAppointment>).render({ username, date, daytime });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function cancelledAppoinmentHTML(username: string, date: string, daytime: string) {
    const r = (EmailCancelledAppointment as unknown as Renderable<EmailCancelledAppointment>).render({ username, date, daytime });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function rejectedAppoinmentHTML(username: string, date: string, daytime: string) {
    const r = (EmailRejectedAppointment as unknown as Renderable<EmailRejectedAppointment>).render({ username, date, daytime });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function changedAppoinmentHTML(username: string, date: string, daytime: string, newDate: string, newDaytime: string, message: string) {
    const r = (EmailChangedAppointment as unknown as Renderable<EmailChangedAppointment>).render({ username, date, daytime, newDate, newDaytime, message });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export default {
    newAccountHTML,
    resetPasswordHTML
};
