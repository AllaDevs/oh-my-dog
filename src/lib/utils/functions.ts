import { MAX_IMAGE_SIZE } from '$lib/config';
import type { Breed } from '@prisma/client';
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
    console.log('imageFile', imageFile);
    if (!imageFile) {
        return null;
    }

    if (!(imageFile instanceof File)) {
        setError(form, field, 'Imagen no válido');
        return null;
    }

    if (imageFile.size === 0) {
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


export function objectInfo(obj: Record<string, unknown>, reference?: string): void {
    console.info(
        `Object info${reference ? ' for ' + reference : ''}:
    - typeof: ${typeof obj}
    - constructor.name: ${obj.constructor.name}
    - Object.getPrototypeOf(obj).constructor.name: ${Object.getPrototypeOf(obj).constructor.name}
`
    );
}


export function createFieldCopier<T extends Record<string, unknown>, P extends FieldPath<T>>(formData: T, path: P): () => PathType<T, P> {
    let data = structuredClone(formData);
    for (const key of path) {
        data = (data as any)[key];
    }
    return () => structuredClone(data as any);
}

export function dateToShortString(date: Date): string {
    return date.toISOString().split('T')[0];
}

type DateToShortString<T extends Record<string, unknown>, K extends keyof T> = T[K] extends Date ? { [k in keyof T]: T[k] } & Record<K, string> : never;

export function mutateToShortString<T extends Record<string, unknown> & Record<K, Date>, K extends keyof T>(obj: T, key: K) {
    obj[key] = obj[key].toISOString().split('T')[0] as unknown as any;
    return obj as { [k in keyof T]: T[k] } & Record<K, string>;
}

export function breedsToInputOptions(breeds: Breed[]): { value: string; text: string; }[] {
    const mappedBreeds = [];
    for (const breed of breeds) {
        mappedBreeds.push({ value: breed.id, text: breed.name });
    }
    return mappedBreeds;
}

export function toUTC(date: Date): Date {
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    return date;
}

export function prettyDate(date: Date): string {
    return date.toISOString()
        .split('T')[0]
        .split('-')
        .join('/');
}
