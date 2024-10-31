import type { Actions, RequestEvent } from './$types';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';
import { AuthService } from '$service/AuthService';
import { redirect } from '@sveltejs/kit';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { APP_REDIRECT } from '$constant/routes-url';
import { cookieUtils } from '$lib/utils/cookies';
import { COOKIE } from '$constant/cookies';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const { statusCode, result, error } = await AuthService.sendEmailResetPassword(event);

		if (statusCode !== SUCCESSFULL_CODE.OK)
			return fail(statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Reset password',
					description: error?.errorMessage,
					type: MessageType.error
				}
			});

		cookieUtils.sentServerFlashMessage(event.cookies, COOKIE.SERVER_FLASH_MESSAGE, {
			title: 'Reset password',
			description: 'Your email is not verified yet. Please check your inbox for the verification email to complete the process.',
			type: MessageType.success
		});
		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.ENTRY_POINT);
	}
};
