import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { DogSex, DogSize } from '@prisma/client';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { prisma } from '$lib/server/prisma';


const schema = z.object({
    name: z.string().min(3),
    size: z.nativeEnum(DogSize),
    birthdate: z.date(),
    sex: z.nativeEnum(DogSex),
    color: z.string().min(3),
    image: z.object({
        width: z.number(),
        height: z.number(),
        url: z.string(),
    }).optional(),
    observation: z.string().min(3).optional(),
    ownerId: z.string(),
    breedId: z.string(),
});


export const load: PageServerLoad = async ({ locals, params }) => {
    const clientId = params.clientId;
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
    const form = await superValidate({ ownerId: owner!.id }, schema);
    return { owner, breeds, form };
};

export const actions: Actions = {
    register: async ({ request }) => {
        const form = await superValidate(request, schema);
        console.log(form);
        if (!form.valid) {
            console.error(form.errors);
            return fail(400, { form });
        }

        let success = false;
        try {
            console.log(form.data);
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
                    image: form.data.image,
                    sex: form.data.sex
                }
            });
        }
        catch (error) {
            console.error(error);
            return fail(400, { form, message: "Failed to create user" });
        }

        return { form };
    }
};
