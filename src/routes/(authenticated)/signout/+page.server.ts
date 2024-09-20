import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals: { database } }) => {
		console.log('signout');
		const { error } = await database.auth.signOut();
		if (error) {
			fail(400, {
				error:
					'Logout failed. Please try again. If the issue persists, close your browser or contact support for help.'
			});
		}

		throw redirect(303, '/signin');
	}
};
