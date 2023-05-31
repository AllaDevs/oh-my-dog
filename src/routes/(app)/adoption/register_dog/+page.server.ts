import { PostState } from '$lib/enums';
import { adoptionBaseSchema } from '$lib/schemas/adoptionSchema';
import { uploadImage } from '$lib/server/cloudinary';
import { prisma } from '$lib/server/prisma';
import { validateImage } from '$lib/utils/functions';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
// import type { PageServerLoad } from './$types';

export const load = (async ({ request }) => {
    const form = await superValidate(adoptionBaseSchema);
    const breeds = await prisma.breed.findMany({
        select: {
            id: true,
            name: true
        }
    });
    return { form, breeds };
}) satisfies PageServerLoad;


export const actions = {
    default: async ({ locals, request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, adoptionBaseSchema);
        const { user } = await locals.auth.validateUser();
        if (!user) {
            setError(form, null, 'Debes iniciar sesión para registrar un perro');
            return fail(401, { form, message: 'Debes iniciar sesión para registrar un perro' });
        }
        const formImage = validateImage(formData, form, 'image');
        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            const tempDog = await prisma.temporalDog.create({
                data: {
                    name: form.data.name,
                    birthdate: form.data.birthdate,
                    size: form.data.size,
                    sex: form.data.sex,
                    color: form.data.color,
                    image: null,
                    observation: form.data.observation,
                    breed: {
                        connect: {
                            id: form.data.breedId
                        }
                    },
                    owner: {
                        connect:{
                            id: user.userId
                        }
                    }
                }
            });
            if (formImage) {
                const imageResult = await uploadImage(formImage, {
                    asset_folder: 'user',
                    public_id: `client/${user.userId}/dog/${tempDog.id}`
                });
                if (imageResult.success) {
                    await prisma.temporalDog.update({
                        where: {
                            id: tempDog.id
                        },
                        data: {
                            image: {
                                url: imageResult.data.url,
                                width: imageResult.data.width,
                                height: imageResult.data.height,
                            }
                        }
                    });
                }
            }
            const adoptionPost = await prisma.adoptionPost.create({
                data: {
                    state: PostState.WAITING,
                    publisher: {
                        connect: {
                            id: user.userId
                        }
                    },
                    registered: false,
                    tempDog: {
                        connect: {
                            id: tempDog.id
                        }
                    }, 
                }
            });
        }
        catch (error) {
            console.log(error);
            return setError(form, null, 'Error al registrar el perro');
        }
        throw redirect(303, "/adoption");
        return { form };
    }
} satisfies Actions;
