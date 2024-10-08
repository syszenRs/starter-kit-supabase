import type { Actions, RequestEvent } from './$types';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';
import { AuthService } from '$service/AuthService';
import { redirect } from '@sveltejs/kit';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { APP_REDIRECT } from '$constant/app-redirect-url';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.EmailResetPassword(event);
		console.log(result);

		if (result.statusCode !== SUCCESSFULL_CODE.OK)
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Reset password',
					description: result.errorMessage,
					type: MessageType.error
				}
			});

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.RESET_PASSWORD_TRIGGER);
	}
};
