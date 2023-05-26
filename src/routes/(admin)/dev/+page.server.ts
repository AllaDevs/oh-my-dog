import { fail } from '@sveltejs/kit';
import { Prisma, Role } from '@prisma/client';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { LuciaError } from 'lucia-auth';

const schema = z.object({
	username: z.string().min(3),
	lastname: z.string().min(3),
	email: z.string().email(),
	password: z.string().min(8)
});

export const load = (async (event) => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) {
			console.error(form);
			return fail(400, { form });
		}

		let success = false;
		try {
			success = await prisma.$transaction(async (prisma) => {
				const user = await auth.createUser({
					primaryKey: {
						providerId: 'email',
						providerUserId: form.data.email,
						password: form.data.password
					},
					attributes: {
						role: Role.VET,
						email: form.data.email
					}
				});

				await prisma.vet.create({
					data: {
						user: {
							connect: {
								id: user.userId
							}
						},
						username: form.data.username,
						lastname: form.data.lastname,
						email: form.data.email
					}
				});

				return true;
			});
		} catch (error) {
			console.error(error);
			if (
				error instanceof Prisma.PrismaClientKnownRequestError ||
				error instanceof LuciaError
			) {
				return setError(form, null, 'Autenfication error');
			}
			return fail(400, { form, message: 'Failed to create user' });
		}

		return { form };
	}
} satisfies Actions;
