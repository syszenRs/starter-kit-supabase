import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail, defaultValues } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authGenericSchema } from '$schema/auth';
import { AuthService } from '$service/authService';

export const load: PageServerLoad = async () => {
	return {
		form: defaultValues(zod(authGenericSchema))
	};
};

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.signin(event);

		if (!result.form.valid || result.response?.error)
			return fail(result.errorCode, {
				form: result.form,
				error: result.errorMessage
			});

		throw redirect(303, '/dashboard');
	}
};
