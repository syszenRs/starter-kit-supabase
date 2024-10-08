import type { Actions, RequestEvent } from './$types';
import { fail } from 'sveltekit-superforms';
import { MessageType } from '$dto/flash-message';
import { AuthService } from '$service/AuthService';

export const actions: Actions = {
	default: async (event: RequestEvent) => {
		const result = await AuthService.EmailResetPassword(event);

		if (!result.form.valid || result.errorMessage)
			return fail(result.statusCode, {
				form: result.form,
				flashMessage: {
					title: 'Reset password',
					description: result.errorMessage,
					type: MessageType.error
				}
			});

		return {
			form: result.form,
			flashMessage: {
				title: 'Reset password',
				description: 'Check out your email to continue the process of reseting the email.',
				type: MessageType.success
			}
		};
	}
};
