import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { database } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const response = await database.auth.signUp({ email, password });

		if (response.error) {
			return fail(400, {
				error:
					'Oops, something went wrong during registration. Please check your email to see if you received a confirmation. If not, double-check your details and try again. If the problem continues, contact our support team for help.'
			});
		} else {
			throw redirect(303, `/confirm-email?email=${email}`);
		}
	}
};
