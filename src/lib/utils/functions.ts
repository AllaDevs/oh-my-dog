import type { Breed } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import type { FieldPath, FormPathLeaves, SuperValidated, UnwrapEffects } from 'sveltekit-superforms/index';
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
        return 'NOT_AN_IMAGE';
    }

    return file;
}


export function validateImage<T extends UnwrapEffects<z.AnyZodObject>>(formData: FormData, form: SuperValidated<T, unknown>, field: FormPathLeaves<z.infer<T>>, maxFileSize: number = 4 * 1024 * 1024) {
    const imageFile = formData.get(field);
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

    if (imageFile.size > maxFileSize) {
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

// export function validateImagesOld<T extends UnwrapEffects<z.AnyZodObject>>(formData: FormData, form: SuperValidated<T, unknown>, pathToArray: string, pathToImage: string) {
//     // let arrayField = form.data;
//     // for (const key of pathToImageArray) {
//     //     arrayField = arrayField[key];
//     // }

//     for (const [k, v] of formData.entries()) {
//         console.log(k, v);
//     }
//     // console.log(`p: ${pathToImageArray} f: ${pathToImageField}\n${JSON.stringify(formData, null,2)}\n${JSON.stringify(form, null,2)}`);
//     console.log(`p: ${pathToArray} f: ${pathToImage}`);

//     const images: File[] = [];
//     for (let i = 0; i < ([1] as any[]).length; i++) {
//         const image = validateImage(formData, form, `${pathToArray}[${i}].${pathToImage}` as FormPathLeaves<z.infer<T>>);
//         if (!image) {
//             return [];
//         }
//         images.push(image);
//     }

//     return images;
// }

export function validateImages<T extends UnwrapEffects<z.AnyZodObject>>(formData: FormData, form: SuperValidated<T, unknown>, fieldAccesor: (i: number) => FormPathLeaves<z.infer<T>>, imageCount: number) {
    const images: File[] = [];
    for (let i = 0; i < imageCount; i++) {
        const image = validateImage(formData, form, fieldAccesor(i));
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


export function fieldValueCloner<T extends Record<string, unknown>, P extends FieldPath<T>>(formData: T, path: P): () => PathType<T, P> {
    let data = structuredClone(formData);
    for (const key of path) {
        data = (data as any)[key];
    }
    return () => structuredClone(data as any);
}


export function dateToShortString(date: Date) {
    return date.toISOString().split('T')[0] as `${number}-${number}-${number}`;
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


export function friendlyDate(date: Date): string {
    return date.toLocaleString();
}
