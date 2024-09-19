import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { superValidate, fail, defaultValues } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { LOGIN_ERRORS } from '$lib/enums/supabase';
import { loginSchema } from '$lib/validation-schema/auth';

export const load: PageServerLoad = async ({ params }) => {
	return {
		form: defaultValues(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			if (error.code == LOGIN_ERRORS.EmailNotConfirmed) {
				throw redirect(303, `/confirm-email?email=${form.data.email}`);
			}

			return fail(400, {
				form,
				error:
					'Please check your credentials and try again.<br>If you continue to have trouble, consider resetting your password or contacting support.'
			});
		} else {
			throw redirect(303, '/dashboard');
		}
	}
};
