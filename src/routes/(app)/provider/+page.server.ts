import { clientToProviderHTML, providerToClientHTML, systemEmail } from '$lib/email';
import { DogServiceType } from '$lib/enums';
import { c } from '$lib/schemas';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';


const schema = z.object({
    providerId: z.string()
});

const anonymousContactSchema = z.object({
    providerId: c.moongoIdSchema,
    firstname: c.firstnameSchema,
    lastname: c.lastnameSchema,
    email: c.emailSchema,
});


export const load = (async (event) => {

    const providers = await prisma.dogServiceProvider.findMany();

    const walkers = providers.filter(provider => provider.type == DogServiceType.WALKING);
    const sitters = providers.filter(provider => provider.type == DogServiceType.SITTING);

    return { walkers, sitters };
}) satisfies PageServerLoad;


export const actions = {
    contact: async ({ request, locals }) => {
        const { session, user } = await locals.auth.validateUser();
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        const client = await prisma.client.findUnique({
            where: {
                id: user!.userId
            },
            select: {
                firstname: true,
                lastname: true,
                email: true,
            }
        });
        const provider = await prisma.dogServiceProvider.findUnique({
            where: {
                id: form.data.providerId
            },
            select: {
                firstname: true,
                lastname: true,
                email: true,
            }
        });
        if (!client || !provider) {
            return fail(400, { form });
        };

        await systemEmail(
            client.email,
            `Hola ${client.firstname}`,
            `Hola! Te enviamos los datos de contacto del proveedor que solicitaste, ${provider.firstname} ${provider.lastname}. Podrás contactarlo por medio del mail ${provider.email}, estamos seguros de
            que será muy bueno con tus perros!`,
            providerToClientHTML(client.firstname, provider.firstname, provider.lastname, provider.email)
        );
        await systemEmail(
            provider.email,
            `Hola ${provider.firstname}!`,
            `Te informamos que el cliente ${client.firstname} ${client.lastname} solicitó tus datos
            de contacto. Podrás contactarlo por medio del mail ${client.email}, esperamos que lleguen a un muy buen acuerdo!`,
            clientToProviderHTML(client.firstname, provider.firstname, provider.lastname, client.email)
        );
    },
    anonymousContact: async ({ request }) => {
        const form = await superValidate(request, anonymousContactSchema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        const provider = await prisma.dogServiceProvider.findUnique({
            where: {
                id: form.data.providerId
            },
            select: {
                firstname: true,
                lastname: true,
                email: true,
            }
        });
        if (!provider) {
            return fail(400, { form });
        };

        await systemEmail(
            form.data.email,
            `Hola ${form.data.firstname}`,
            `Hola! Te enviamos los datos de contacto del proveedor que solicitaste, ${provider.firstname} ${provider.lastname}. Podrás contactarlo por medio del mail ${provider.email}, estamos seguros de
            que será muy bueno con tus perros!`,
            providerToClientHTML(form.data.firstname, provider.firstname, provider.lastname, provider.email)
        );
        await systemEmail(
            provider.email,
            `Hola ${provider.firstname}!`,
            `Te informamos que el cliente ${form.data.firstname} ${form.data.lastname} solicitó tus datos
            de contacto. Podrás contactarlo por medio del mail ${form.data.email}, esperamos que lleguen a un muy buen acuerdo!`,
            clientToProviderHTML(form.data.firstname, provider.firstname, provider.lastname, form.data.email)
        );
    }
} satisfies Actions;
