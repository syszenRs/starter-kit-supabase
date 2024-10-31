import { redirect, error } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { AuthService } from '$service/AuthService';
import { REDIRECT_CODE, SERVER_ERROR_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { APP_REDIRECT } from '$constant/routes-url';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const { statusCode, error: outputError } = await AuthService.signout(event);

		if (statusCode !== SUCCESSFULL_CODE.OK) {
			error(SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR, {
				message: outputError!.errorMessage
			});
		}

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.SIGNIN);
	}
};
