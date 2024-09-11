import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { LOGIN_ERRORS } from '$lib/enums/supabase';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		console.log('signin', error);
		if (error) {
			if (error.code == LOGIN_ERRORS.EmailNotConfirmed) {
				throw redirect(303, `/confirm-email?email=${email}`);
			}

			return fail(400, {
				error:
					'Sign-in failed. Please check your credentials and try again. If you continue to have trouble, consider resetting your password or contacting support.'
			});
		} else {
			throw redirect(303, '/dashboard');
		}
	}
};
