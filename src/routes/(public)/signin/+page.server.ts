import type { Actions, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail } from 'sveltekit-superforms';
import { AuthService } from '$service/AuthService';
import { MessageType } from '$dto/flash-message';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '$constant/supabase-auth';
import { APP_REDIRECT } from '$constant/routes-url';
import { COOKIE } from '$constant/cookies';
import { cookieUtils } from '$lib/utils/cookies';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const { statusCode, data, error } = await AuthService.signin(event);

		if (statusCode !== SUCCESSFULL_CODE.OK) {
			return fail(statusCode, {
				form: data.form,
				flashMessage: {
					title: 'Signin',
					description: error?.errorMessage,
					type: MessageType.error
				}
			});
		} else if (data.response?.error?.code === AUTH_ERRORS.EMAIL_NOT_CONFIRMED) {
			cookieUtils.sentServerFlashMessage(event.cookies, COOKIE.SERVER_FLASH_MESSAGE, {
				title: 'Signin',
				description: 'Your email is not verified yet. Please check your inbox for the verification email to complete the process.',
				type: MessageType.success
			});
			cookieUtils.setCookie(event.cookies, COOKIE.CONFIRM_EMAIL, data.form.data.email);
			throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.CONFIRM_EMAIL);
		}

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.DASHBOARD);
	}
};
