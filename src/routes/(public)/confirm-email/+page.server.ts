import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { database } }) => {
		const formData = await request.formData();
		const confirmationCode = formData.get('code') as string;
		const email = formData.get('email') as string;

		const response = await database.auth.verifyOtp({
			type: 'signup',
			token: confirmationCode,
			email: email
		});

		if (response.error) {
			return fail(400, {
				error:
					"The code you entered didn't work. Please double-check and try again. If you're still having trouble, you can request a new code or contact support for assistance."
			});
		}

		await database.auth.signOut();
		throw redirect(303, '/signin');
	}
};
