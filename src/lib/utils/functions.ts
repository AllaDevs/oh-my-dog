import { MAX_IMAGE_SIZE } from '$lib/config';
import type { RequestEvent } from '@sveltejs/kit';
import type { FieldPath, UnwrapEffects, Validation } from 'sveltekit-superforms/index';
import { setError } from 'sveltekit-superforms/server';
import type { z } from 'zod';
import type { PathType } from './types';


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


export function validateImage<T extends UnwrapEffects<z.AnyZodObject>>(formData: FormData, form: Validation<T, unknown>, field: keyof z.infer<T> | FieldPath<T>) {
    const imageFile = formData.get(String(field));

    if (!imageFile) {
        return null;
    }

    if (!(imageFile instanceof File)) {
        setError(form, field, 'Imagen no válido');
        return null;
    }

    if (imageFile.size > MAX_IMAGE_SIZE) {
        setError(form, field, 'Imagen demasiado grande');
        return null;
    }

    if (
        imageFile.type !== 'image/jpeg' &&
        imageFile.type !== 'image/png' &&
        imageFile.type !== 'image/webp'
    ) {
        setError(form, field, 'Solo se permiten imagenes (jpg, png, webp)');
        return null;
    }

    return imageFile;
}

export function validateImages<T extends UnwrapEffects<z.AnyZodObject>>(formData: FormData, form: Validation<T, unknown>, pathToImageArray: (number | string)[], pathToImageField: (number | string)[]) {
    let arrayField = form.data;
    for (const key of pathToImageArray) {
        arrayField = arrayField[key];
    }

    const images: File[] = [];
    for (let i = 0; i < (arrayField as any[]).length; i++) {
        const image = validateImage(formData, form, [...pathToImageArray, i, ...pathToImageField] as keyof z.infer<T> | FieldPath<T>);
        if (!image) {
            return [];
        }
        images.push(image);
    }
    return images;
}
// export function validateImages<T extends UnwrapEffects<z.AnyZodObject>>(formData: FormData, form: Validation<T, unknown>, length: number, prePath: (number | string)[], field: string) {
//     let arrayField = form.data;
//     for (const key of prePath) {
//         arrayField = arrayField[key];
//     }
    
//     const images: File[] = [];
//     for (let i = 0; i < (arrayField as any[]).length; i++) {
//         const image = validateImage(formData, form, [...prePath, i, field] as any);
//         if (!image) {
//             return [];
//         }
//         images.push(image);
//     }
//     return images;
// }

export function objectInfo(obj: Record<string, unknown>, reference?: string): void {
    console.info(
        `Object info${reference ? ' for ' + reference : ''}:
    - typeof: ${typeof obj}
    - constructor.name: ${obj.constructor.name}
    - Object.getPrototypeOf(obj).constructor.name: ${Object.getPrototypeOf(obj).constructor.name}
`
    );
}


export function fieldCloner<T extends Record<string, unknown>, P extends FieldPath<T>>(formData: T, path: P): () => PathType<T, P> {
    let data = structuredClone(formData);
    for (const key of path) {
        data = (data as any)[key];
    }
    return () => structuredClone(data as any);
}
