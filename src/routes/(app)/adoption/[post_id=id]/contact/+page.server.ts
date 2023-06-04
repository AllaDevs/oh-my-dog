import { EmailError, adoptionContactHTML, systemEmail } from '$lib/email';
import { PostState } from '$lib/enums';
import { c } from '$lib/schemas';
import { redirectToLogin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { logError } from '$lib/server/utils';
import type { AdoptionPost, Client, RegisteredDog, TemporalDog } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const anonymousContactSchema = c.contactBaseSchema;


type DiscriminatedAdoptionPost = (AdoptionPost & {
    publisher: Client,
} & ({
    registered: true,
    registeredDog: RegisteredDog & {
        breed: {
            name: string,
        };
    },
} | {
    registered: false,
    temporalDog: TemporalDog & {
        breed: {
            name: string,
        };
    },
}));

export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();

    const post = await prisma.adoptionPost.findUnique({
        where: {
            id: event.params.post_id
        },
        include: {
            publisher: true,
            registeredDog: {
                include: {
                    breed: true,
                }
            },
            temporalDog: {
                include: {
                    breed: true,
                }
            },
        }
    });
    if (!post) {
        throw error(404, 'No se encontro el post de adopción');
    }

    if (post.publisherId === user?.userId) {
        throw error(403, 'No puedes contactarte con tu propio post de adopción');
    }

    const form = await superValidate(event.request, anonymousContactSchema, { id: 'anonymous' });
    return {
        form: form,
        post: post as DiscriminatedAdoptionPost,
    };
}) satisfies PageServerLoad;


export const actions = {
    clientContact: async ({ locals, request, url, params }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para contactarte con el dueño del perro como cliente'));
        }
        const form = await superValidate(request, z.object({}));

        try {
            const [adoptionPost, client] = await prisma.$transaction([
                prisma.adoptionPost.findUnique({
                    where: {
                        id: params.post_id
                    },
                    include: {
                        publisher: true,
                        temporalDog: {
                            select: {
                                name: true,
                            }
                        },
                        registeredDog: {
                            select: {
                                name: true,
                            }
                        },
                    }
                }),
                prisma.client.findUnique({
                    where: {
                        id: user.userId
                    }
                })
            ]);
            if (!adoptionPost) {
                throw error(404, 'No se encontro el post de adopción con el que te quieres contactar');
            }
            if (adoptionPost.state === PostState.RESOLVED) {
                return setError(form, null, 'El post de adopción ya fue resuelto, no puedes contactarte con el dueño');
            }
            if (!client) {
                throw error(403, 'No eres un cliente registrado');
            }
            if (adoptionPost.publisherId === user.userId) {
                throw error(403, 'No puedes contactarte con tu propio post de adopción');
            }

            const dogName = (adoptionPost.registered ? adoptionPost.registeredDog?.name : adoptionPost.temporalDog?.name) ?? 'Uno de tus perros';
            await systemEmail(
                {
                    name: adoptionPost.publisher.username,
                    address: adoptionPost.publisher.email,
                },
                `${client.username} quiere contactarse contigo por la adopcion de ${adoptionPost.registered ? adoptionPost.registeredDog?.name : adoptionPost.temporalDog?.name}`,
                `El cliente con los datos:\nNombre: ${client.username}\nApellido: ${client.email}\nEmail: ${client.email}\nTelefono: Email: ${client.phone}\nQuiere contactarse contigo por la adopcion de ${adoptionPost.registered ? adoptionPost.registeredDog?.name : adoptionPost.temporalDog?.name}, ponte en contacto con el para continuar con el proceso de adopción.`,
                adoptionContactHTML(client.username, client.lastname, client.email, client.phone, dogName),

            );
        }
        catch (error) {
            if (error instanceof EmailError) {
                form.errors._errors = ['Ocurrio un error con el servicio de emails al enviar el mensaje, intente mas tarde'];
                return fail(400, { form });
            }

            logError('adoption', 'Unexpected error sending client adoption contact email', error);
            form.errors._errors = ['Ocurrio un error inesperado al enviar el email de contacto, intente mas tarde'];
            return fail(400, { form });
        }

        return { form };
    },
    anonymousContact: async ({ request, url, params }) => {
        const form = await superValidate(request, anonymousContactSchema, { id: 'anonymous' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const adoptionPost = await prisma.adoptionPost.findUnique({
                where: {
                    id: params.post_id
                },
                include: {
                    publisher: true,
                    temporalDog: {
                        select: {
                            name: true,
                        }
                    },
                    registeredDog: {
                        select: {
                            name: true,
                        }
                    },
                }
            });
            if (!adoptionPost) {
                throw error(404, 'No se encontro el post de adopción con el que te quieres contactar');
            }
            if (adoptionPost.state === PostState.RESOLVED) {
                return setError(form, null, 'El post de adopción ya fue resuelto, no puedes contactarte con el dueño');
            }

            const dogName = (adoptionPost.registered ? adoptionPost.registeredDog?.name : adoptionPost.temporalDog?.name) ?? 'Uno de tus perros';
            await systemEmail(
                {
                    name: adoptionPost.publisher.username,
                    address: adoptionPost.publisher.email,
                },
                `${form.data.username} quiere contactarse contigo por la adopcion de ${dogName}`,
                `El cliente con los datos:\nNombre: ${form.data.username}\nApellido: ${form.data.email}\nEmail: ${form.data.email}\nTelefono: Email: ${form.data.phone}\nQuiere contactarse contigo por la adopcion de ${adoptionPost.registered ? adoptionPost.registeredDog?.name : adoptionPost.temporalDog?.name}, ponte en contacto con el para continuar con el proceso de adopción.`,
                adoptionContactHTML(form.data.username, form.data.lastname, form.data.email, form.data.phone, dogName),

            );
        }
        catch (error) {
            if (error instanceof EmailError) {
                return setError(form, null, 'Ocurrio un error con el servicio de emails al enviar el mensaje, intente mas tarde');
            }

            logError('adoption', 'Unexpected error sending client adoption contact email', error);
            return setError(form, null, 'Ocurrio un error inesperado al enviar el email de contacto, intente mas tarde');
        }

        return { form };
    },
} satisfies Actions;
