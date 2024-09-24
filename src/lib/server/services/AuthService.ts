import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { AuthResponseDto, ConfirmEmailResponseDto } from '$dto/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authGenericSchema, confirmEmailSchema, signupSchema } from '$schema/auth';
import { AuthController } from '$controller/AuthController';
import { CLIENT_ERROR_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '../../constants/supabase-auth';

export class AuthService {
	public static async signin({ request, locals }: RequestEvent): Promise<AuthResponseDto> {
		const form = await superValidate(request, zod(authGenericSchema));

		if (!form.valid) return { errorCode: CLIENT_ERROR_CODE.BAD_REQUEST, form };

		const response = await AuthController.signin(locals.database, form.data);

		//TODO: SHOULD URL BE HARDCODED ??
		if (response.error?.code == AUTH_ERRORS.EMAIL_NOT_CONFIRMED) throw redirect(303, `/confirm-email?email=${form.data.email}`);

		const error = response?.error
			? 'Please check your credentials and try again.<br>If you continue to have trouble, consider resetting your password or contacting support.'
			: '';
		return {
			errorCode: response.error?.status ?? SUCCESSFULL_CODE.OK,
			form,
			errorMessage: error,
			response
		};
	}

	public static async signup({ request, locals }: RequestEvent): Promise<AuthResponseDto> {
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) return { errorCode: CLIENT_ERROR_CODE.BAD_REQUEST, form };

		const response = await AuthController.signup(locals.database, form.data);

		let error = '';
		if (response.error) {
			if (CLIENT_ERROR_CODE.TOO_MANY_REQUESTS === response.error.status || response.error.code === AUTH_ERRORS.RATE_LIMIT_EXCEEDED) {
				error = 'Too many attempts have been made.<br>Please try again later or reset your password if needed.';
			} else {
				error =
					'We were unable to complete your registration.<br>Please try a different email or reset your password if you have trouble logging in.';
			}
		}

		return {
			errorCode: response.error?.status ?? SUCCESSFULL_CODE.OK,
			form,
			errorMessage: error,
			response
		};
	}

	public static async signout({ locals }: RequestEvent): Promise<{ error: string }> {
		const response = await AuthController.signout(locals.database);

		return {
			error: response.error ? 'Logout failed. Please try again.<br>If the issue persists, close your browser or contact support for help.' : ''
		};
	}

	public static async confirmEmail(event: RequestEvent): Promise<ConfirmEmailResponseDto> {
		const form = await superValidate(event.request, zod(confirmEmailSchema));

		const response = await AuthController.confirmEmail(event.locals.database, form.data);

		let error = '';
		if (response.error) {
			error = 'We were unable to complete your registration.<br>Please check your code and try again.';
		} else {
			//Confirm email signins the user so we need to signout
			await this.signout(event);
		}

		return {
			errorCode: response.error?.status ?? SUCCESSFULL_CODE.OK,
			form,
			errorMessage: error
		};
	}
}
