import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { database } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const response = await database.auth.resetPasswordForEmail(email);

		console.log('reset pw', response);

		return {
			error: 'Check out your email to continue the process of reseting the email.'
		};
	}
};
