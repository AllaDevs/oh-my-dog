import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { Role } from '@prisma/client';


export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate();
    // if (session) {
    //     throw redirect(302, '/employee');
    // }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const { name, email, password } = Object.fromEntries(
            await request.formData(),
        ) as Record<string, string>;

        try {
            await auth.createUser({
                primaryKey: {
                    providerId: 'email',
                    providerUserId: email,
                    password,
                },
                attributes: {
                    role: Role.CLIENT,
                    email,
                    name,
                }
            });
        }
        catch (error) {
            console.error(error);
            return fail(400, { message: "Failed to create user" });
        }

        throw redirect(302, '/vet');
    }
};
