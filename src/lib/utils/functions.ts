import type { RequestEvent } from '@sveltejs/kit';

export function handleLoginRedirect(
    event: RequestEvent,
    message: string = "Debes iniciar sesión para acceder a esta página"
) {
    const redirectTo = event.url.pathname + event.url.search;
    return `/login?redirectTo=${redirectTo}&message=${encodeURIComponent(message)}`;
}