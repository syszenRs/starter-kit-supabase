import { redirect, error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { AuthService } from '$service/authService';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const response = await AuthService.signout(event);

		if (response.error) {
			error(500, {
				message: response.error
			});
		}

		throw redirect(303, '/signin');
	}
};
