import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { AuthService } from '$service/authService';
import { defaultValues, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authGenericSchema } from '$schema/auth';

export const load: PageServerLoad = async () => {
	return {
		form: defaultValues(zod(authGenericSchema))
	};
};

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.signup(event);

		if (result.response?.error || !result.form.valid) {
			return fail(result.errorCode, {
				form: result.form,
				error: result.errorMessage
			});
		} else {
			throw redirect(303, `/confirm-email?email=${result.form.data.email}`);
		}
	}
};
