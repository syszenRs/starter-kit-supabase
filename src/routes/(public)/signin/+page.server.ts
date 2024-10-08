import type { Actions, RequestEvent } from './$types';
import { redirect } from '@sveltejs/kit';
import { fail } from 'sveltekit-superforms';
import { AuthService } from '$service/AuthService';
import { MessageType } from '$dto/flash-message';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '$constant/supabase-auth';
import { APP_REDIRECT } from '$constant/app-redirect-url';
import { COOKIE } from '$constant/cookies';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.signin(event);

		if (result.statusCode !== SUCCESSFULL_CODE.OK)
			if (result.response?.error?.code === AUTH_ERRORS.EMAIL_NOT_CONFIRMED) {
				event.cookies.set(COOKIE.CONFIRM_EMAIL, result.form.data.email, {
					secure: false,
					maxAge: 60 * 60 * 1, //1h
					priority: 'low',
					sameSite: 'strict',
					path: '/'
				});

				//TODO: SHOULD URL BE HARDCODED ??
				throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.CONFIRM_EMAIL);
			} else {
				return fail(result.statusCode, {
					form: result.form,
					flashMessage: {
						title: 'Signin',
						description: result.errorMessage,
						type: MessageType.error
					}
				});
			}

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.DASHBOARD);
	}
};
