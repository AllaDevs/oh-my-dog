import { EmailError, newAccountHTML, systemEmail } from '$lib/email';
import { Role } from '$lib/enums';
import { clientCompleteRegisterSchema, dogRegisterSchema } from '$lib/schemas';
import { uploadImage } from '$lib/server/cloudinary';
import { logError } from '$lib/server/logging';
import { Lucia, auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { validateImages } from '$lib/utils/functions';
import { Prisma, type Client, type RegisteredDog } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { defaultValues, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';


const initialFormData = {
    dogs: [defaultValues(dogRegisterSchema)]
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
        const formImages = validateImages(formData, form, (i) => (`dogs[${i}].image` as const), form.data.dogs.length);

        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        if (formImages.length !== form.data.dogs.length) {
            return setError(form, '', 'No todos los perros tienen una imagen válida, por favor revisa los campos de imagen');
        }

        const emailExists = await prisma.authUser.findUnique({
            where: {
                email: form.data.email
            },
            select: {
                id: true
            }
        });
        if (emailExists) {
            return setError(form, 'email', 'Ya existe una cuenta con este correo');
        }

        let client: Client & { dog: RegisteredDog[]; };
        try {
            const dogsData = [];
            for (let i = 0; i < form.data.dogs.length; i++) {
                const dog = form.data.dogs[i];
                for (const safeDog of dogsData) {
                    if (
                        safeDog.name === dog.name &&
                        safeDog.birthdate === dog.birthdate
                    ) {
                        return setError(
                            form,
                            `dogs[${i}].birthdate`,
                            `La fecha de nacimiento y el nombre de este perro ya existe en el formulario, revise los datos ingresados`
                        );
                    }
                }
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
            for (const dog of dogsData) {
                dog.birthdate = new Date(dog.birthdate) as unknown as string;
            }

            client = await prisma.client.create({
                data: {
                    firstname: form.data.firstname,
                    lastname: form.data.lastname,
                    email: form.data.email,
                    birthdate: new Date(form.data.birthdate),
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
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    if ((error.meta?.target as string[]).includes('email')) {
                        return setError(form, 'dni', 'Ya existe un usuario con este email');
                    }
                    if ((error.meta?.target as string[]).includes('dni')) {
                        return setError(form, 'dni', 'Ya existe un usuario con este dni');
                    }
                    if ((error.meta?.target as string[]).includes('birthdate')) {
                        return setError(
                            form,
                            '',
                            `Uno de los perros a registrar tiene nombre y fecha igual a uno ya registrado, revise los datos ingresados`
                        );
                    }
                }
                return setError(form, '', 'Error con la base de datos al crear el cliente');
            }

            throw error;
        }

        const generatedPassword = Lucia.generateRandomString(10);
        let authUser: Lucia.User;
        try {
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
        }
        catch (error) {
            if (error instanceof Lucia.LuciaError) {
                try {
                    await prisma.client.delete({
                        where: {
                            id: client.id
                        }
                    });
                }
                catch (error) {
                    if (error instanceof Prisma.PrismaClientKnownRequestError) {
                        console.error(error);
                    }
                    else {
                        throw error;
                    }
                }
                if (error.message === "AUTH_DUPLICATE_KEY_ID") {
                    return setError(form, 'email', 'Ya existe una cuenta con este correo');
                }
                return setError(form, '', 'Error de autenticacion al crear el usuario, intente mas tarde');
            }
            throw error;
        }

        try {
            const imagesPromises = [];
            for (let index = 0; index < formImages.length; index++) {
                const image = formImages[index];
                imagesPromises.push(uploadImage(image, {
                    asset_folder: 'user',
                    public_id: `client/${client.id}/dog/${client.dog[index].id}`
                }));
            }
            const imagesResult = await Promise.all(imagesPromises);

            for (let index = 0; index < imagesResult.length; index++) {
                if (!imagesResult[index].success) {
                    setError(form, `dogs[${index}].image`, 'Error al subir la imagen, carguela mas tarde');
                }
            }

            const dogUpdatesPromises = [];
            for (let index = 0; index < imagesResult.length; index++) {
                const image = imagesResult[index];
                if (!image.success) {
                    continue;
                }
                dogUpdatesPromises.push(prisma.registeredDog.update({
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
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                setError(form, '', 'Ocurrio un error con la base de datos al subir las imagenes, carguelas mas tarde');
            }
            else {
                throw error;
            }
        }

        try {
            await systemEmail(
                { name: form.data.firstname, address: form.data.email },
                'Cuenta creada en ¡Oh my dog!',
                `Bienvenido ${form.data.firstname} a ¡Oh my dog!. Tu contraseña es: ${generatedPassword}, puedes cambiarla en 'Mi cuenta'.`,
                newAccountHTML(form.data.firstname, form.data.lastname, generatedPassword)
            );
        }
        catch (error) {
            if (error instanceof EmailError) {
                return setError(form, '', 'Ocurrio un error con el servicio de emails al enviar la contraseña, el usuario puede iniciar sesion mediante la opcion de recuperar contraseña');
            }

            logError('email', 'uknown error message when sending password to new client', error);
            return setError(form, '', 'Ocurrio un error inesperado al enviar la contraseña, el usuario puede iniciar sesion mediante la opcion de recuperar contraseña');
        }

        throw redirect(303, `/vet/client/${client.id}`);
        // return { form };
    }
} satisfies Actions;
