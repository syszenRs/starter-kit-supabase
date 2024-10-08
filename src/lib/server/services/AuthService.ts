import type { RequestEvent } from '@sveltejs/kit';
import type { AuthResponseDto, ConfirmEmailResponseDto, ResetEmailResponseDto } from '$lib/server/dto/auth';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authBaseSchema, emailCodeSchema, emailSchema, signupSchema } from '$schema/auth';
import { AuthController } from '$controller/AuthController';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '$constant/supabase-auth';

export class AuthService {
	private static genericError = 'Something bad happen in our side.<br>Please consider contacting support to report.';
	private static TOO_MANY_REQUESTS_ERROR = 'Too many attempts have been made.<br>Please try again later or reset your password if needed.';

	private static _getDefaultResponse(form: SuperValidated<Record<string, unknown>>) {
		return {
			statusCode: CLIENT_ERROR_CODE.BAD_REQUEST,
			form,
			errorMessage: undefined
		};
	}

	private static _isTooManyRequestsError(status?: number, code?: string) {
		return CLIENT_ERROR_CODE.TOO_MANY_REQUESTS === status || code === AUTH_ERRORS.RATE_LIMIT_EXCEEDED;
	}

	public static async signin({ request, locals }: RequestEvent): Promise<AuthResponseDto> {
		const form = await superValidate(request, zod(authBaseSchema));

		const response = this._getDefaultResponse(form) as AuthResponseDto;

		if (!form.valid) return response;

		const res = await AuthController.signin(locals.database, form.data);

		if (res.response) {
			const emailNotConfirmed = res.response.error?.code === AUTH_ERRORS.EMAIL_NOT_CONFIRMED;

			response.response = res.response;
			response.statusCode = res.response.error?.status && !emailNotConfirmed ? res.response.error.status : SUCCESSFULL_CODE.OK;
			if (res.response.error && !emailNotConfirmed)
				response.errorMessage = this._isTooManyRequestsError(res.response.error.status, res.response.error.code)
					? this.TOO_MANY_REQUESTS_ERROR
					: 'Please check your credentials and try again.<br>If you continue to have trouble, consider resetting your password or contacting support.';
		} else {
			response.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			response.errorMessage = this.genericError;
		}

		return response;
	}

	public static async signup({ request, locals }: RequestEvent): Promise<AuthResponseDto> {
		const form = await superValidate(request, zod(signupSchema));

		const response = this._getDefaultResponse(form) as AuthResponseDto;

		if (!form.valid) return response;

		const res = await AuthController.signup(locals.database, form.data);

		if (res.response) {
			response.response = res.response;
			response.statusCode = res.response.error?.status ? res.response.error.status : SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				response.errorMessage = this._isTooManyRequestsError(res.response.error.status, res.response.error.code)
					? this.TOO_MANY_REQUESTS_ERROR
					: 'We were unable to complete your registration.<br>Please try a different email or reset your password if you have trouble logging in.';
			}
		} else {
			response.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			response.errorMessage = this.genericError;
		}

		return response;
	}

	public static async signout({ locals }: RequestEvent): Promise<{ error: string }> {
		const res = await AuthController.signout(locals.database);

		return {
			error:
				res.error || res.response?.error
					? 'Logout failed. Please try again.<br>If the issue persists, close your browser or contact support for help.'
					: ''
		};
	}

	public static async confirmEmail(event: RequestEvent): Promise<ConfirmEmailResponseDto> {
		const form = await superValidate(event.request, zod(emailCodeSchema));

		const response = this._getDefaultResponse(form) as ConfirmEmailResponseDto;

		if (!form.valid) return response;

		const res = await AuthController.confirmEmail(event.locals.database, form.data);

		if (res.response) {
			response.response = res.response;
			response.statusCode = res.response.error?.status ? res.response.error.status : SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				response.errorMessage =
					'We were unable to complete your registration.<br>Please check your code and try again.<br>If the issue persists try to ask for a new code.';
			} else {
				//Confirm email signins the user so we need to signout
				await this.signout(event);
			}
		} else {
			response.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			response.errorMessage = this.genericError;
		}

		return response;
	}

	public static async resendSignupConfirmCode({ request, locals }: RequestEvent): Promise<ResetEmailResponseDto> {
		const form = await superValidate(request, zod(emailSchema));

		const response = this._getDefaultResponse(form) as ResetEmailResponseDto;

		if (!form.valid) return response;

		const res = await AuthController.resendSignupConfirmCode(locals.database, form.data);

		if (res.response) {
			response.statusCode = res.response.error?.status ? res.response.error.status : SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				response.errorMessage = `We couldn't fulfill your request.<br>Try again or contact support for help.`;
			}
		} else {
			response.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			response.errorMessage = this.genericError;
		}

		return response;
	}

	public static async EmailResetPassword({ request, locals }: RequestEvent): Promise<ResetEmailResponseDto> {
		const form = await superValidate(request, zod(emailSchema));

		const response = this._getDefaultResponse(form) as ResetEmailResponseDto;

		if (!form.valid) return response;

		const res = await AuthController.EmailResetPassword(locals.database, form.data);

		if (res.response) {
			response.statusCode = res.response.error?.status ? res.response.error.status : SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				response.errorMessage = `We couldn't fulfill your request.<br>If the issue persists, close your browser or contact support for help.`;
			}
		} else {
			response.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			response.errorMessage = this.genericError;
		}

		return response;
	}
}
