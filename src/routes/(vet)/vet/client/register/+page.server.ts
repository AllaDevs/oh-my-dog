import { EmailError, newAccountHTML, systemEmail } from '$lib/email';
import { Role } from '$lib/enums';
import { clientCompleteRegisterSchema, dogRegisterSchema } from '$lib/schemas/clientSchema';
import { uploadImage, type UploadImageResponse } from '$lib/server/cloudinary';
import { Lucia, auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { validateImages } from '$lib/utils/functions';
import type { SuccessOf } from '$lib/utils/types';
import { Prisma } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { defaultData, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


const initialFormData = {
    dogs: [defaultData(dogRegisterSchema)]
};


export const load = (async ({ locals }) => {
    const form = await superValidate(
        initialFormData,
        clientCompleteRegisterSchema,
        { errors: false }
    );
    const breeds = await prisma.breed.findMany({
        select: {
            id: true,
            name: true
        }
    });

    return { form, breeds };
}) satisfies PageServerLoad;


export const actions = {
    client: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, clientCompleteRegisterSchema);

        const formImages = validateImages(formData, form, ['dogs'], ['image']);

        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        let authUser: Lucia.User;
        try {
            await prisma.$transaction(async (tx) => {
                // this could be replaced with creating user first and creating dogs after maybe that can link the owner and breed too?
                const dogsData = [];
                for (const dog of form.data.dogs) {
                    dogsData.push({
                        name: dog.name,
                        size: dog.size,
                        birthdate: dog.birthdate,
                        sex: dog.sex,
                        color: dog.color,
                        observation: dog.observation,
                        breedId: dog.breedId,
                        image: null
                    });
                }

                const client = await tx.client.create({
                    data: {
                        username: form.data.username,
                        lastname: form.data.lastname,
                        email: form.data.email,
                        birthdate: form.data.birthdate,
                        phone: form.data.phone,
                        dni: form.data.dni,
                        dog: {
                            createMany: {
                                data: dogsData
                            }
                        }
                    },
                    include: {
                        dog: true
                    }
                });

                const generatedPassword = Lucia.generateRandomString(10);

                authUser = await auth.createUser({
                    primaryKey: {
                        providerId: 'email',
                        providerUserId: form.data.email,
                        password: generatedPassword
                    },
                    attributes: {
                        userId: client.id,
                        role: Role.CLIENT,
                        email: form.data.email
                    }
                });

                await systemEmail(
                    { name: form.data.username, address: form.data.email },
                    'Cuenta creada en ¡OhMyDog!',
                    `Bienvenido ${form.data.username} a OhMyDog!. Tu contraseña es: ${generatedPassword}, puedes cambiarla en tu perfil.`,
                    newAccountHTML(form.data.username, form.data.lastname, generatedPassword)
                );

                if (formImages.length) {
                    const imagesPromises = [];
                    for (const image of formImages) {
                        imagesPromises.push(uploadImage(image, {
                            asset_folder: 'user',
                            public_id: `client/${client.id}/dog/${client.dog[0].id}`
                        }));
                    }
                    const imagesResult = await Promise.all(imagesPromises);

                    for (let index = 0; index < imagesResult.length; index++) {
                        if (!imagesResult[index].success) {
                            setError(form, ['dogs', index, 'image'], 'Error al subir la imagen, carguela mas tarde');
                        }

                    }
                    if (!form.valid) {
                        throw new Error('Error al subir las imagenes');
                    }
                    const dogUpdatesPromises = [];
                    for (let index = 0; index < imagesResult.length; index++) {
                        const image = imagesResult[index] as SuccessOf<UploadImageResponse>;
                        dogUpdatesPromises.push(tx.registeredDog.update({
                            where: {
                                id: client.dog[index].id
                            },
                            data: {
                                image: {
                                    url: image.data.secure_url,
                                    width: image.data.width,
                                    height: image.data.height
                                }
                            }
                        }));
                    }
                    await Promise.all(dogUpdatesPromises);
                }
            });
        } catch (error) {
            // @ts-expect-error
            if (authUser) {
                try {
                    await auth.deleteUser(authUser.authId);
                }
                catch (error) {
                    console.error(error);
                }
            }
            if (error instanceof Lucia.LuciaError) {
                // TODO: handle lucia specific errors
                return setError(form, 'email', 'Error de autenticacion al crear el usuario, intente mas tarde');
            }
            if (error instanceof EmailError) {
                return setError(form, null, 'Error al enviar el correo con la contraseña, intente mas tarde');
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // TODO: handle db specific errors
                return setError(form, null, 'Error al crear el usuario con la base de datos, intente mas tarde');
            }
            console.error(error);
            return setError(form, null, 'Error al crear el usuario (desconocido), intente mas tarde');
        }

        return { form };
    }
} satisfies Actions;
