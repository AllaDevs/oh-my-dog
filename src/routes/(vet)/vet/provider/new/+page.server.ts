import { prisma } from '$lib/server/prisma';
import { Day, DogServiceType } from '@prisma/client';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { PageServerLoad } from '../$types';

const schema = z.object({
    type: z.nativeEnum(DogServiceType),
    email: z.string().email(),
    areas: z.string(),
    username: z.string(),
    lastname: z.string(),
    description: z.string().max(280).optional(),
    workingHour: z.array(z.object({
        day: z.nativeEnum(Day),
        start: z.string(),
        end: z.string()
    }))
});

export const load: PageServerLoad = async (event) => {

    const form = await superValidate(schema);

    return { form };
};

export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }
        try {

            const workingHours = [];
            for (const workingHour of form.data.workingHour) {
                workingHours.push(
                    {
                        day: workingHour.day,
                        start: new Date(workingHour.start),
                        end: new Date(workingHour.end)
                    });
            };

            const newProvider = await prisma.dogServiceProvider.create({
                data: {
                    type: form.data.type,
                    email: form.data.email,
                    areas: form.data.areas,
                    username: form.data.username,
                    lastname: form.data.lastname,
                    description: form.data.description,
                    workingHour: {
                        create: workingHours
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
            return message(form, "Creación fallida", { status: 400 });
        };


        return message(form, "Proveedor creado de forma exitosa!");

    }
};
