import type { ComponentProps, SvelteComponent } from 'svelte';
import EmailAdoptionContact from './templates/EmailAdoptionContact.svelte';
import EmailAdoptionContactConfirmation from './templates/EmailAdoptionContactConfirmation.svelte';
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


export function newAccountHTML(firstname: string, lastname: string, password: string) {
    const r = (EmailNewAccount as unknown as Renderable<EmailNewAccount>).render({ firstname, lastname, password });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function resetPasswordHTML(href: string) {
    const r = (EmailResetPassword as unknown as Renderable<EmailResetPassword>).render({ href });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function confirmedAppoinmentHTML(firstname: string, date: string, daytime: string) {
    const r = (EmailConfirmedAppointment as unknown as Renderable<EmailConfirmedAppointment>).render({ firstname, date, daytime });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function cancelledAppoinmentHTML(firstname: string, date: string, daytime: string) {
    const r = (EmailCancelledAppointment as unknown as Renderable<EmailCancelledAppointment>).render({ firstname, date, daytime });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function rejectedAppoinmentHTML(firstname: string, date: string, daytime: string) {
    const r = (EmailRejectedAppointment as unknown as Renderable<EmailRejectedAppointment>).render({ firstname, date, daytime });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function changedAppoinmentHTML(firstname: string, date: string, daytime: string, newDate: string, newDaytime: string, message: string) {
    const r = (EmailChangedAppointment as unknown as Renderable<EmailChangedAppointment>).render({ firstname, date, daytime, newDate, newDaytime, message });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function adoptionContactHTML(firstname: string, lastname: string, email: string, phone: string, dogname: string) {
    const r = (EmailAdoptionContact as unknown as Renderable<EmailAdoptionContact>).render({ firstname, lastname, email, phone, dogname });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}

export function adoptionContactConfirmHTML(firstname: string, lastname: string, email: string, dogname: string) {
    const r = (EmailAdoptionContactConfirmation as unknown as Renderable<EmailAdoptionContactConfirmation>).render({ firstname, lastname, email, dogname });
    return r.html.replace('</head>', `<style>${r.css.code}</style></head>`);
}


export default {
    newAccountHTML,
    resetPasswordHTML,
    adoptionContactHTML,
    confirmedAppoinmentHTML,
    cancelledAppoinmentHTML,
    rejectedAppoinmentHTML,
    changedAppoinmentHTML,
    adoptionContactConfirmHTML,
};
