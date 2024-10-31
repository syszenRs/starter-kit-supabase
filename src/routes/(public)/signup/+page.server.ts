import type { Actions, RequestEvent } from './$types';
import { AuthService } from '$service/AuthService';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { redirect } from '@sveltejs/kit';
import { APP_REDIRECT } from '$constant/routes-url';
import { COOKIE } from '$constant/cookies';
import { cookieUtils } from '$lib/utils/cookies';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const { statusCode, result, error } = await AuthService.signup(event);

		if (statusCode !== SUCCESSFULL_CODE.OK)
			return fail(statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Signup',
					description: error?.errorMessage,
					type: MessageType.error
				}
			});

		cookieUtils.sentServerFlashMessage(event.cookies, COOKIE.SERVER_FLASH_MESSAGE, {
			title: 'Signup',
			description: 'Check your email for the code to complete your registration.',
			type: MessageType.success
		});
		cookieUtils.setCookie(event.cookies, COOKIE.CONFIRM_EMAIL, result.form.data.email);
		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.CONFIRM_EMAIL);
	}
};
