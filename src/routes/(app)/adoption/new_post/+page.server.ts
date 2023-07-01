import { PostState } from '$lib/enums';
import { c, temporalDogRegisterSchema } from '$lib/schemas';
import { redirectToLogin } from '$lib/server/auth';
import { logError } from '$lib/server/logging';
import { prisma } from '$lib/server/prisma';
import { Prisma } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { defaultValues, setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const clientDogSelectedSchema = z.object({
    dogId: c.moongoIdSchema
});

const temporalDogFormInitialData = defaultValues(temporalDogRegisterSchema);

export const load = (async ({ locals, url }) => {
    const { user } = await locals.auth.validateUser();
    if (!user) {
        throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para poner en adopción un perro'));
    }

    const [breeds, clientDogs] = await prisma.$transaction([
        prisma.breed.findMany(),
        prisma.registeredDog.findMany({
            where: {
                ownerId: user.userId,
                adoptionPost: null,
                archived: false
            }
        })
    ]);

    const form = await superValidate(temporalDogRegisterSchema, { id: 'newDog' });

    return {
        form,
        breeds,
        clientDogs
    };
}) satisfies PageServerLoad;


export const actions = {
    existingDog: async ({ locals, request, url }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para poner en adopción un perro'));
        }

        const form = await superValidate(request, clientDogSelectedSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const adoptionPost = await prisma.adoptionPost.create({
                data: {
                    state: PostState.WAITING,
                    registered: true,
                    publisherId: user.userId,
                    dogId: form.data.dogId
                }
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    if ((error.meta?.target as string).includes('dogId')) {
                        form.errors.dogId = ['El perro ya está en adopción'];
                        return fail(400, { form });
                    }
                }
                form.errors._errors = ['Ocurrio un problema al registrar el perro'];
                return fail(400, { form });
            }

            logError('adoption', 'Unexpected error during client registered dog for adoption', error);
            throw error;
        }

        return { form };
    },
    newDog: async ({ locals, request, url }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para poner en adopción un perro'));
        }

        const form = await superValidate(request, temporalDogRegisterSchema, { id: 'newDog' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const tempDogWithPost = await prisma.temporalDog.create({
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
                            id: user.userId
                        }
                    },
                    adoptionPost: {
                        create: {
                            state: PostState.WAITING,
                            publisher: {
                                connect: {
                                    id: user.userId
                                }
                            },
                            registered: false,
                        }
                    }
                },
                include: {
                    adoptionPost: true
                }
            });
        }
        catch (error) {
            logError('adoption', 'Unexpected error during new dog for adoption', error);
            // TODO: handle errors
            return setError(form, '', 'Error al registrar el perro');
        }

        form.data = temporalDogFormInitialData;
        return { form };
    }
} satisfies Actions;
