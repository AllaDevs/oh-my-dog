import { adoptionPostUpdateSchema } from '$lib/schemas';
import { redirectToLogin } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { handleLoginRedirect, mutateToShortString } from '$lib/utils/functions';
import { PostState } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const deletePostSchema = z.object({});

const resolvePostSchema = z.object({
    detail: z.string().max(256, `Maximo de 256 caracteres`),
});


export const load = (async (event) => {
    const { user } = await event.locals.auth.validateUser();
    if (!user) {
        throw redirect(303, handleLoginRedirect(event));
    }

    const [post, breeds] = await prisma.$transaction([
        prisma.adoptionPost.findUnique({
            where: {
                id: event.params.post_id
            },
            include: {
                temporalDog: true,
                registeredDog: true
            },
        }),
        prisma.breed.findMany()
    ]);

    if (!post) {
        throw error(404, 'No se encontro el post de adopción');
    }
    if (post.publisherId !== user.userId) {
        throw error(403, 'No tienes permiso para ver este post');
    }

    const dogInitialData = (post.registered ? post.registeredDog : post.temporalDog)!;
    dogInitialData.observation ??= undefined as any;

    const [updateForm, deleteForm, resolveForm] = await Promise.all([
        superValidate(mutateToShortString(dogInitialData, 'birthdate') as any, adoptionPostUpdateSchema, { id: 'update' }),
        superValidate(deletePostSchema, { id: 'delete' }),
        superValidate(resolvePostSchema, { id: 'resolve' })
    ]);

    return {
        post,
        breeds,
        updateForm,
        deleteForm,
        resolveForm,
    };
}) satisfies PageServerLoad;


export const actions = {
    delete: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser();
        const form = await superValidate(request, deletePostSchema, { id: 'delete' });
        if (!form.valid) {
            return fail(400, { form });
        }

        if (!user) {
            setError(form, '', 'Debes iniciar sesión para registrar un perro');
            return fail(401, { form });
        }

        try {
            const post = await prisma.adoptionPost.findUnique({
                where: {
                    id: params.post_id
                },
            });
            if (!post) {
                throw error(404, 'No se encontro el post de adopción que quieres eliminar');
            }
            if (post.publisherId !== user.userId) {
                throw error(403, 'No tienes permiso para eliminar este post');
            }

            await prisma.adoptionPost.delete({
                where: {
                    id: params.post_id
                }
            });
            if (!post.registered) {
                await prisma.temporalDog.delete({
                    where: {
                        id: post.dogId
                    }
                });
            }
        }
        catch (err) {
            console.error(err);
            // TODO: handle deletion errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        throw redirect(303, '/adoption');
    },
    update: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para editar un post de adopción'));
        }

        const form = await superValidate(request, adoptionPostUpdateSchema, { id: 'update' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const post = await prisma.adoptionPost.findUnique({
                where: {
                    id: params.post_id
                },
            });
            if (!post) {
                throw error(404, 'No se encontro el post de adopción que quieres actualizar');
            }
            if (post.publisherId !== user.userId) {
                throw error(403, 'No tienes permiso para actualizar este post');
            }
            if (post.registered) {
                throw error(403, 'No tienes permiso para actualizar la informacion de un perro registrado');
            }
            await prisma.temporalDog.update({
                where: {
                    id: post.dogId
                },
                data: {
                    name: form.data.name,
                    birthdate: new Date(form.data.birthdate),
                    size: form.data.size,
                    sex: form.data.sex,
                    color: form.data.color,
                    observation: form.data.observation,
                    breedId: form.data.breedId
                }
            });
        }
        catch (err) {
            console.error(err);
            //TODO: handle update errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        return { updateForm: form };
    },
    resolve: async ({ request, url, locals, params }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) {
            throw redirect(303, redirectToLogin(url, 'Debes iniciar sesión para editar un post de adopción'));
        }

        const form = await superValidate(request, resolvePostSchema, { id: 'resolve' });
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const post = await prisma.adoptionPost.findUnique({
                where: {
                    id: params.post_id
                },
            });
            if (!post) {
                throw error(404, 'No se encontro el post de adopción que quieres actualizar');
            }
            if (post.publisherId !== user.userId) {
                throw error(403, 'No tienes permiso para actualizar este post');
            }

            await prisma.$transaction([
                prisma.adoptionPost.update({
                    where: {
                        id: post.id
                    },
                    data: {
                        state: PostState.RESOLVED,
                        resolvedAt: new Date(),
                        resolutionDetail: form.data.detail,
                    }
                }),
                post.registered ?
                    prisma.registeredDog.update({
                        where: {
                            id: post.dogId
                        },
                        data: {
                            archived: true
                        }
                    }) :
                    prisma.temporalDog.update({
                        where: {
                            id: post.dogId
                        },
                        data: {
                            archived: true
                        }
                    })
            ]);
        }
        catch (err) {
            console.error(err);
            //TODO: handle update errors
            throw error(500, 'Ocurrio un error al eliminar el post');
        }

        return { resolveForm: form };
    }
} satisfies Actions;
