import { clientToProviderHTML, providerToClientHTML, systemEmail } from '$lib/email';
import { DogServiceType } from '$lib/enums';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
    providerId: z.string()
});

export const load: PageServerLoad = async (event) => {

    const providers = await prisma.dogServiceProvider.findMany({
        select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            workingHour: true,
            type: true,
            areas: true,
            description: true,
        }
    });

    const walkers = providers.filter(provider => provider.type == DogServiceType.WALKING);
    const sitters = providers.filter(provider => provider.type == DogServiceType.SITTING);

    return { walkers, sitters };
};

export const actions: Actions = {
    contact: async ({ request, locals, url }) => {
        const { session, user } = await locals.auth.validateUser();
        console.log(user);
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        console.log(form.data);

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
        if (!client || !provider) return fail(400, { form });
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
    }
};;
