import type { PageServerLoad, RequestEvent, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { CLIENT_ERROR_CODE, REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AuthService } from '$service/AuthService';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';
import { COOKIE } from '$constant/cookies';
import { cookieUtils } from '$lib/utils/cookies';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const hashToken = url.searchParams.get('token');

	if (!hashToken) {
		cookieUtils.sentServerFlashMessage(cookies, COOKIE.SERVER_FLASH_MESSAGE, {
			title: 'Reset password',
			description: 'It seems that no token was provided..',
			type: MessageType.error
		});
		throw redirect(CLIENT_ERROR_CODE.BAD_REQUEST, '/signin/reset');
	}
};

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const hashToken = event.url.searchParams.get('token') as string;

		const { statusCode, result, error } = await AuthService.resetPassword(event, hashToken);

		if (statusCode !== SUCCESSFULL_CODE.OK) {
			return fail(statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Reset password',
					description: error?.errorMessage,
					type: MessageType.error
				}
			});
		}

		cookieUtils.sentServerFlashMessage(event.cookies, COOKIE.SERVER_FLASH_MESSAGE, {
			title: 'Reset password',
			description: 'Reset password completed. You can now login with your new password.',
			type: MessageType.success
		});
		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, '/signin');
	}
};
