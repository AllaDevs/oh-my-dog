import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';


const schema = z.object({
    text: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    city: z.string(),
});


export const load = async (event) => {
    const form = superValidate(schema);
    return { form };
};


export const actions = {
    basic: async ({ request, locals, url }) => {
        const form = await superValidate(request, schema);
        if (!form.valid) {
            console.error(form);
            return fail(400, { form });
        }

        console.log(form.data);
        if (form.data.text.length < 5)
            return setError(form, 'text', 'Error during authentication');
        if (!form.data.email.startsWith('test'))
            return setError(form, 'email', 'Nor registered email');
        return { form };
    }
};
