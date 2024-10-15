import type { Actions, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail } from 'sveltekit-superforms';
import { AuthService } from '$service/AuthService';
import { MessageType } from '$dto/flash-message';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '$constant/supabase-auth';
import { APP_REDIRECT } from '$constant/app-redirect-url';
import { COOKIE } from '$constant/cookies';
import { cookieUtils } from '$lib/utils/cookies';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.signin(event);

		cookieUtils.setCookie(
			event.cookies,
			COOKIE.SERVER_FLASH_MESSAGE,
			JSON.stringify({
				title: 'Signin',
				description: 'heyyy',
				type: MessageType.error
			})
		);

		if (result.statusCode !== SUCCESSFULL_CODE.OK) {
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Signin',
					description: result.errorMessage,
					type: MessageType.error
				}
			});
		} else if (result.response?.error?.code === AUTH_ERRORS.EMAIL_NOT_CONFIRMED) {
			cookieUtils.setCookie(event.cookies, COOKIE.CONFIRM_EMAIL, result.form.data.email);
			throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.CONFIRM_EMAIL);
		}

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.DASHBOARD);
	}
};
