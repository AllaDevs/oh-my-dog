import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { DogSex, DogSize } from '$lib/enums';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { prisma } from '$lib/server/prisma';
import { uploadImage } from '$lib/server/cloudinary';
import { randomUUID } from 'crypto';


const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4mb

const schema = z.object({
    name: z.string().min(3),
    size: z.nativeEnum(DogSize),
    birthdate: z.date(),
    sex: z.nativeEnum(DogSex),
    color: z.string().min(3),
    image: z.any(),
    observation: z.string().min(3).optional(),
    ownerId: z.string(),
    breedId: z.string(),
});


export const load = (async ({ locals, params }) => {
    const clientId = params.client_id;
    const breeds = await prisma.breed.findMany({
        select: {
            id: true,
            name: true,
        }
    });
    const owner = await prisma.client.findUnique({
        where: {
            id: clientId,
        },
        select: {
            id: true,
            username: true,
            lastname: true,
            email: true,
        }
    });
    const form = await superValidate({ ownerId: owner!.id }, schema, { errors: false });
    return { owner, breeds, form };
}) satisfies PageServerLoad;


export const actions = {
    register: async ({ request, params }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, schema);
        form.data.ownerId = params.client_id;
        const formImage = formData.get('image');

        if (!formImage || !(formImage instanceof File)) {
            console.log('image', JSON.stringify(formImage, null, 2));
            setError(form, 'image', 'Imagen no válido');
        }
        else if (formImage.size > MAX_IMAGE_SIZE) {
            setError(form, 'image', 'Imagen demasiado grande');
        }
        else if (formImage.type !== 'image/jpeg' && formImage.type !== 'image/png' && formImage.type !== 'image/webp') {
            setError(form, 'image', 'Solo se permiten imagenes (jpg, png, webp)');
        }

        if (!form.valid) {
            console.error(form.errors);
            return fail(400, { form });
        }

        try {
            const image = await uploadImage(
                formImage as File,
                { asset_folder: 'user', public_id: `client/${params.client_id}/dog/${randomUUID()}` });
            if (!image.success) {
                return setError(form, 'image', 'Error al subir la imagen');
            }
            const dog = await prisma.registeredDog.create({
                data: {
                    owner: {
                        connect: {
                            id: form.data.ownerId,
                        }
                    },
                    breed: {
                        connect: {
                            id: form.data.breedId,
                        }
                    },
                    name: form.data.name,
                    birthdate: form.data.birthdate,
                    color: form.data.color,
                    observation: form.data.observation,
                    size: form.data.size,
                    image: {
                        width: 0,
                        height: 0,
                        url: image.result.url
                    },
                    sex: form.data.sex
                }
            });
        }
        catch (error) {
            console.error(error);
            return fail(400, { form, message: "Failed to create dog" });
        }

        return { form };
    }
} satisfies Actions;
