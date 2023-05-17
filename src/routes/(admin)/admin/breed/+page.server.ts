import { fail } from '@sveltejs/kit';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';


const schema = z.object({
    name: z.string().min(3)
});


export const load = (async (event) => {
    const form = await superValidate(schema);
    const breeds = await prisma.breed.findMany();

    return { form, breeds };
}) satisfies PageServerLoad;


export const actions = {
    registerBreed: async ({ request }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            const result = await prisma.breed.create({
                data: {
                    name: form.data.name,
                }
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return setError(form, null, 'Autenfication error');
            }
            return fail(400, { form, message: "Failed to create user" });
        }

        return { form };
    },
    registerTestBreeds: async () => {
        try {
            await prisma.breed.deleteMany();
            await prisma.breed.createMany({
                data: breedSample,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return fail(400, { message: "Failed to create breeds" });
            }
            return fail(400, { message: "Failed to create breeds" });
        }
    }
} satisfies Actions;

const smallBreedSample = [
    'Bull Terrier',
    'Chihuahua',
    'Dachshund',
    'French Bulldog',
    'Jack Russell Terrier',
    'Maltese',
    'Miniature Pinscher',
    'Pug',
    'Pit Bull Terrier',
    'Husky',
];

const breedSample = [
    { name: 'Bull Terrier' },
    { name: 'Chihuahua' },
    { name: 'Dachshund' },
    { name: 'French Bulldog' },
    { name: 'Jack Russell Terrier' },
    { name: 'Maltese' },
    { name: 'Miniature Pinscher' },
    { name: 'Pug' },
    { name: 'Pit Bull Terrier' },
    { name: 'Husky' },
    { name: 'Labrador' },
    { name: 'Golden Retriever' },
];
