import { AuthService } from '$service/AuthService';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { MessageType } from '$dto/flash-message';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { cookieUtils } from '$lib/server/utils/cookies';
import { APP_REDIRECT } from '$constant/app-redirect-url';
import { COOKIE } from '$constant/cookies';

export const load: PageServerLoad = async ({ cookies }: RequestEvent) => {
	const userEmail = cookieUtils.getAndDestroy(cookies, COOKIE.CONFIRM_EMAIL);

	if (!userEmail) throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.SIGNIN);

	return {
		email: userEmail
	};
};

export const actions: Actions = {
	confirmCode: async (event: RequestEvent) => {
		const result = await AuthService.confirmEmail(event);

		if (result.statusCode !== SUCCESSFULL_CODE.OK) {
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Email confirmation',
					description: result.errorMessage,
					type: MessageType.error
				}
			});
		}

		//TODO: work on a way to send flash message from server side, prob via cookie and on get request on hooks/layout? get it, delete it and pass it down to an $effect hook
		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.SIGNIN);
	},
	resendCode: async (event: RequestEvent) => {
		const result = await AuthService.resendSignupConfirmCode(event);

		if (result.statusCode !== SUCCESSFULL_CODE.OK) {
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Resend email code',
					description: result.errorMessage,
					type: MessageType.error
				}
			});
		}

		return {
			flashMessage: {
				title: 'Resend email code',
				description: 'Check your email for the new code',
				type: MessageType.success
			}
		};
	}
};
