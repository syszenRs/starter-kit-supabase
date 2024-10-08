import type { Actions, RequestEvent } from './$types';
import { AuthService } from '$service/AuthService';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';
import { REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { redirect } from '@sveltejs/kit';
import { APP_REDIRECT } from '$constant/app-redirect-url';
import { COOKIE } from '$constant/cookies';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.signup(event);

		if (result.statusCode !== SUCCESSFULL_CODE.OK)
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Signup',
					description: result.errorMessage,
					type: MessageType.error
				}
			});

		event.cookies.set(COOKIE.CONFIRM_EMAIL, result.form.data.email, {
			secure: false,
			maxAge: 60 * 60 * 1, //1h
			priority: 'low',
			sameSite: 'strict',
			path: '/'
		});

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.CONFIRM_EMAIL);
	}
};
