import { prisma } from '$lib/server/prisma';
import { Prisma } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const breedSchema = z.object({
    name: z.string().min(3)
});


export const load = (async (event) => {
    const form = await superValidate(breedSchema);
    const breeds = await prisma.breed.findMany();

    return { form, breeds };
}) satisfies PageServerLoad;


export const actions = {
    registerBreed: async ({ request }) => {
        const form = await superValidate(request, breedSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        try {
            await prisma.breed.create({
                data: {
                    name: form.data.name
                }
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return setError(form, '', 'Autenfication error');
            }
            return fail(400, { form, message: 'Failed to create user' });
        }

        return { form };
    },
    registerDefaultBreeds: async () => {
        try {
            await prisma.breed.deleteMany();
            await prisma.breed.createMany({
                data: defaultBreeds
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return fail(400, { message: 'Failed to create breeds with the db' });
            }
            return fail(400, { message: 'Failed to create breeds, unknown reason' });
        }
    }
} satisfies Actions;


const defaultBreeds = [
    { "name": "Akita Inu" },
    { "name": "Beagle" },
    { "name": "Bichón Frisé" },
    { "name": "Border Collie" },
    { "name": "Boxer" },
    { "name": "Braco Alemán" },
    { "name": "Bulldog Americano" },
    { "name": "Bulldog Francés" },
    { "name": "Bulldog Inglés" },
    { "name": "Cane Corso" },
    { "name": "Caniche" },
    { "name": "Chihuahua" },
    { "name": "Chow Chow" },
    { "name": "Cocker Spaniel Inglés" },
    { "name": "Collie" },
    { "name": "Crestado Chino" },
    { "name": "Dalmata" },
    { "name": "Doberman Pinscher" },
    { "name": "Dogo Argentino" },
    { "name": "Dogo de Burdeos" },
    { "name": "Dóberman" },
    { "name": "Galgo Español" },
    { "name": "Golden Retriever" },
    { "name": "Gran Danés" },
    { "name": "Husky Siberiano" },
    { "name": "Jack Russell Terrier" },
    { "name": "Labrador Retriever" },
    { "name": "Maltese" },
    { "name": "Pastor Alemán" },
    { "name": "Pastor Belga Malinois" },
    { "name": "Pastor de Shetland" },
    { "name": "Pequinés" },
    { "name": "Pinscher Miniatura" },
    { "name": "Pomerania" },
    { "name": "Rottweiler" },
    { "name": "San Bernardo" },
    { "name": "Setter Irlandés" },
    { "name": "Schnauzer Estándar" },
    { "name": "Schnauzer Gigante" },
    { "name": "Schnauzer Miniatura" },
    { "name": "Shar Pei" },
    { "name": "Shiba Inu" },
    { "name": "Shih Tzu" },
    { "name": "Staffordshire Bull Terrier" },
    { "name": "Staffordshire Terrier Americano" },
    { "name": "Terranova" },
    { "name": "Weimaraner" },
    { "name": "West Highland White Terrier" },
    { "name": "Yorkshire Terrier" },
    { "name": "Desconocida" },
    { "name": "Sin especificar" },
];
