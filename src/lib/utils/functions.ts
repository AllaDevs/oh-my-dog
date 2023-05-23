import type { RequestEvent } from '@sveltejs/kit';


export function handleLoginRedirect(
    event: RequestEvent,
    message: string = 'Debes iniciar sesión para acceder a esta página'
) {
    const redirectTo = event.url.pathname + event.url.search;
    return `/login?redirect_to=${redirectTo}&message=${encodeURIComponent(message)}`;
}


export function getImage(formData: FormData, name: string, maxFileSize: number = 1024 * 1024 * 5) {
    const file = formData.get(name);
    if (!file || !(file instanceof File)) {
        return 'NOT_A_FILE';
    }
    if (file.size > maxFileSize) {
        return 'FILE_TOO_BIG';
    }
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
    if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/png' &&
        file.type !== 'image/webp' &&
        file.type !== 'image/avif'
    ) {
        console.log('file.type', file.type);
        return 'NOT_AN_IMAGE';
    }
    return file;
}
