import { confirmEmailSchema } from '$schema/auth';
import { AuthService } from '$service/authService';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { defaultValues } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	return {
		form: defaultValues(zod(confirmEmailSchema))
	};
};

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.confirmEmail(event);

		if (!result.form.valid || result.response?.error) {
			return fail(result.errorCode, {
				form: result.form,
				error: result.errorMessage
			});
		}

		throw redirect(303, '/signin');
	}
};
