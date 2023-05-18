import type { SvelteComponent, ComponentProps } from 'svelte';
import EmailNewAccount from './templates/EmailNewAccount.svelte';
import EmailResetPassword from './templates/EmailResetPassword.svelte';


// function addGeneratedStyle(html: string, css: string) {
//     return html.replace('</head>', `<style>${css}</style></head>`);
// }

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

export default {
    newAccountHTML,
    resetPasswordHTML
}
