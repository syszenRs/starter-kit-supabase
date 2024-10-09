import type { PageServerLoad, RequestEvent, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { CLIENT_ERROR_CODE, REDIRECT_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AuthService } from '$service/AuthService';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';

export const load: PageServerLoad = async ({ url }) => {
	const hashToken = url.searchParams.get('token');

	if (!hashToken) {
		//SEND FLASH ERROR
		throw redirect(CLIENT_ERROR_CODE.BAD_REQUEST, '/signin/reset');
	}
};

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const hashToken = event.url.searchParams.get('token') as string;

		const result = await AuthService.resetPassword(event, hashToken);
		console.log('dfres', result);
		if (result.statusCode !== SUCCESSFULL_CODE.OK) {
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Reset password',
					description: result.errorMessage,
					type: MessageType.error
				}
			});
		}

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, '/signin');
	}
};
