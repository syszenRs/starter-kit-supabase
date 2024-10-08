import { redirect, error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { AuthService } from '$service/AuthService';
import { REDIRECT_CODE, SERVER_ERROR_CODE } from '$constant/http-code';
import { APP_REDIRECT } from '$constant/app-redirect-url';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const response = await AuthService.signout(event);

		if (response.error) {
			error(SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR, {
				message: response.error
			});
		}

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.SIGNIN);
	}
};
