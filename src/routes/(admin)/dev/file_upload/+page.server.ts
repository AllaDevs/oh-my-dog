import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { uploadImage } from '$lib/server/cloudinary';
import { randomUUID } from 'crypto';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2mb

const schema = z.object({
	file: z.any(),
	files: z.any()
});

function validateFiles(data: unknown) {
	if (!data || !Array.isArray(data)) {
		return 'Archivo no válido';
	}
	for (const file of data) {
		if (!file || !(file instanceof File)) {
			return 'Archivo no válido';
		}
		if (file.size > MAX_FILE_SIZE) {
			return 'Archivo demasiado grande';
		}
		// image types: 'image/jpeg', 'image/png', 'image/webp'
		if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
			return 'Solo se permiten archivos de imagen (jpg, png, webp)';
		}
	}
	return data as File[];
}

export const load = (async ({ locals }) => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	uploadSingleFile: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		console.log(formData);
		const file = formData.get('file');
		if (!file || !(file instanceof File)) {
			console.log('file', JSON.stringify(file, null, 2));
			return setError(form, 'file', 'Archivo no válido');
		}
		if (file.size > MAX_FILE_SIZE) {
			return setError(form, 'file', 'Archivo demasiado grande');
		}
		// image types: 'image/jpeg', 'image/png', 'image/webp'
		if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
			return setError(form, 'file', 'Solo se permiten archivos de imagen (jpg, png, webp)');
		}
		if (!form.valid) {
			return { form };
		}
		const { user } = await locals.auth.validateUser();

		// some file transformation
		const res = await uploadImage(file, {
			resource_type: 'image',
			public_id: `test/pedro/${randomUUID()}`
		});
		console.log(res);
		if (!res.success) {
			return setError(form, null, 'Error al subir el archivo');
		}

		// return some info of success
		return message(form, res.result!.secure_url);
	},
	uploadMultipleFiles: async ({ request, locals }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);

		const filesInput = formData.get('files');
		const files = validateFiles(filesInput);
		if (typeof files === 'string') {
			return setError(form, null, files);
		}

		// some file transformation
	}
} satisfies Actions;
