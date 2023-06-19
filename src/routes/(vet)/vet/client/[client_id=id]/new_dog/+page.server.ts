import { dogRegisterSchema } from '$lib/schemas';
import { uploadImage } from '$lib/server/cloudinary';
import { prisma } from '$lib/server/prisma';
import { validateImage } from '$lib/utils/functions';
import { Prisma, type RegisteredDog } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { defaultData, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


const initialFormData = defaultData(dogRegisterSchema);

export const load = (async (event) => {
    const form = await superValidate(dogRegisterSchema);
    const breeds = await prisma.breed.findMany();

    return { form, breeds };
}) satisfies PageServerLoad;


export const actions = {
    register: async ({ request, params }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, dogRegisterSchema);

        const formImage = validateImage(formData, form, 'image')!;
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        let dog: RegisteredDog;
        try {
            dog = await prisma.registeredDog.create({
                data: {
                    name: form.data.name,
                    birthdate: new Date(form.data.birthdate),
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
                        connect: {
                            id: params.client_id
                        }
                    }
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    // TODO: check if the error is because of unique constraint?
                }
                return setError(form, null, 'Error con la base de datos al registrar el perro, intente mas tarde');
            }
            throw error;
        }

        try {
            const dogImage = await uploadImage(
                formImage,
                {
                    asset_folder: 'user',
                    public_id: `client/${params.client_id}/dog/${dog.id}`
                }
            );
            if (!dogImage.success) {
                return setError(form, 'image', 'Error al subir la imagen, carguela mas tarde');
            }

            await prisma.registeredDog.update({
                where: {
                    id: dog.id
                },
                data: {
                    image: {
                        url: dogImage.data.secure_url,
                        width: dogImage.data.width,
                        height: dogImage.data.height
                    }
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return setError(form, null, 'Ocurrio un error con la base de datos al subir las imagenes, carguelas mas tarde');
            }

            throw error;
        }

        form.data = initialFormData;
        form.data.image = undefined;

        return { form };
    }
} satisfies Actions;
