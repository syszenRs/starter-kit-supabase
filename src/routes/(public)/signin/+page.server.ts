import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail, defaultValues } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$schema/auth';
import { AuthService } from '$service/authService';

export const load: PageServerLoad = async () => {
	return {
		form: defaultValues(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const response = await AuthService.signin(event);

		const error = response.response?.error
			? 'Please check your credentials and try again.<br>If you continue to have trouble, consider resetting your password or contacting support.'
			: '';

		if (!response.form.valid || response.response?.error)
			return fail(response.errorCode, {
				form: response.form,
				error
			});

		throw redirect(303, '/dashboard');
	}
};
