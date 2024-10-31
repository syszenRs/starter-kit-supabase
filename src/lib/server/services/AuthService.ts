import type { RequestEvent } from '@sveltejs/kit';
import type { AuthWithResponseDto } from '$lib/server/dto/auth';
import type { ServiceResponseDto, ServiceSimpleResponseDto } from '$serverDto/service';
import type { SuperformFormType } from '$serverDto/generic';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	authBaseSchema,
	emailCodeSchema,
	emailSchema,
	resetEmailSchema,
	signupSchema,
	type authBaseSchemaDto,
	type emailCodeSchemaDto,
	type emailSchemaDto,
	type resetEmailSchemaDto
} from '$schemaValidate/auth';
import { SupabaseAuthController } from '$controller/SupabaseAuthController';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '$constant/supabase-auth';

export class AuthService {
	private static genericError = 'Something bad happen in our side.<br>Please consider contacting support to report.';
	private static TOO_MANY_REQUESTS_ERROR = 'Too many attempts have been made.<br>Please try again later or reset your password if needed.';

	private static _isTooManyRequestsError(status?: number, code?: string) {
		return CLIENT_ERROR_CODE.TOO_MANY_REQUESTS === status || code === AUTH_ERRORS.RATE_LIMIT_EXCEEDED;
	}

	//TODO: CONTINUE
	private static _getDefaultResponseV2<FormType extends SuperformFormType>(
		form: SuperValidated<FormType>
	): ServiceResponseDto<AuthWithResponseDto<FormType>> {
		return {
			statusCode: CLIENT_ERROR_CODE.BAD_REQUEST,
			result: {
				form,
				response: undefined
			},
			error: undefined
		};
	}

	public static async signin({ request, locals }: RequestEvent): Promise<ServiceResponseDto<AuthWithResponseDto<authBaseSchemaDto>>> {
		const form = await superValidate(request, zod(authBaseSchema));

		const output = this._getDefaultResponseV2<authBaseSchemaDto>(form);

		if (!form.valid) return output;

		const res = await SupabaseAuthController.signin(locals.database, form.data);

		if (res.response) {
			const emailNotConfirmed = res.response.error?.code === AUTH_ERRORS.EMAIL_NOT_CONFIRMED;

			output.result.response = res.response;
			output.statusCode = SUCCESSFULL_CODE.OK;
			if (res.response.error && !emailNotConfirmed) output.statusCode = res.response.error.status ?? SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = {
				errorMessage: this._isTooManyRequestsError(res.response.error?.status, res.response.error?.code)
					? this.TOO_MANY_REQUESTS_ERROR
					: 'Please check your credentials and try again.<br>If you continue to have trouble, consider resetting your password or contacting support.'
			};
		} else {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = { errorMessage: this.genericError };
		}

		return output;
	}

	public static async signup({ request, locals }: RequestEvent): Promise<ServiceResponseDto<AuthWithResponseDto<authBaseSchemaDto>>> {
		const form = await superValidate(request, zod(signupSchema));

		const output = this._getDefaultResponseV2<authBaseSchemaDto>(form);

		if (!form.valid) return output;

		const res = await SupabaseAuthController.signup(locals.database, form.data);

		if (res.response) {
			output.result.response = res.response;
			output.statusCode = SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				output.statusCode = res.response.error.status ?? SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
				output.error = {
					errorMessage: this._isTooManyRequestsError(res.response.error.status, res.response.error.code)
						? this.TOO_MANY_REQUESTS_ERROR
						: 'We were unable to complete your registration.<br>Please try a different email or reset your password if you have trouble logging in.'
				};
			}
		} else {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = { errorMessage: this.genericError };
		}

		return output;
	}

	public static async signout({ locals }: RequestEvent): Promise<ServiceSimpleResponseDto> {
		const res = await SupabaseAuthController.signout(locals.database);

		const hasError = res.error || res.response?.error;

		return {
			statusCode: hasError ? CLIENT_ERROR_CODE.BAD_REQUEST : SUCCESSFULL_CODE.OK,
			error: {
				errorMessage: hasError ? 'Logout failed. Please try again.<br>If the issue persists, close your browser or contact support for help.' : ''
			}
		};
	}

	public static async confirmEmail(event: RequestEvent): Promise<ServiceResponseDto<AuthWithResponseDto<emailCodeSchemaDto>>> {
		const form = await superValidate(event.request, zod(emailCodeSchema));

		const output = this._getDefaultResponseV2<emailCodeSchemaDto>(form);

		if (!form.valid) {
			output.error = {
				errorMessage: form.errors.email ? 'It seems that we lost your email somehow..<br>Please try to sign in, so we can identify you.' : ''
			};
			return output;
		}

		const res = await SupabaseAuthController.verifySignupEmail(event.locals.database, form.data);

		if (res.response) {
			output.result.response = res.response;
			output.statusCode = SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				output.statusCode = res.response.error.status ?? SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
				output.error = {
					errorMessage:
						'We were unable to complete your registration.<br>Please check your code and try again.<br>If the issue persists try to ask for a new code.'
				};
			} else {
				//Confirm email signins the user so we need to signout
				await this.signout(event);
			}
		} else {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = {
				errorMessage: this.genericError
			};
		}

		return output;
	}

	public static async resendSignupConfirmCode({ request, locals }: RequestEvent): Promise<ServiceResponseDto<AuthWithResponseDto<emailSchemaDto>>> {
		const form = await superValidate(request, zod(emailSchema));

		const output = this._getDefaultResponseV2<emailSchemaDto>(form);

		if (!form.valid) {
			output.error = {
				errorMessage: 'It seems that we lost your email somehow..<br>Please try to sign in, so we can identify you.'
			};
			return output;
		}

		const res = await SupabaseAuthController.resendSignupConfirmCode(locals.database, form.data);

		if (res.response) {
			output.statusCode = SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				output.statusCode = res.response.error?.status ?? SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
				output.error = {
					errorMessage: `We couldn't fulfill your request.<br>Try again or contact support for help.`
				};
			}
		} else {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = { errorMessage: this.genericError };
		}

		return output;
	}

	public static async sendEmailResetPassword({ request, locals }: RequestEvent): Promise<ServiceResponseDto<AuthWithResponseDto<emailSchemaDto>>> {
		const form = await superValidate(request, zod(emailSchema));

		const output = this._getDefaultResponseV2<emailSchemaDto>(form);

		if (!form.valid) return output;

		const res = await SupabaseAuthController.sendEmailResetPassword(locals.database, form.data);

		if (res.response) {
			output.statusCode = SUCCESSFULL_CODE.OK;
			if (res.response.error) {
				output.statusCode = res.response.error.status ?? SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
				output.error = {
					errorMessage: `We couldn't fulfill your request.<br>If the issue persists, close your browser or contact support for help.`
				};
			}
		} else {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = { errorMessage: this.genericError };
		}

		return output;
	}

	public static async resetPassword(
		event: RequestEvent,
		tokenUrlParam: string
	): Promise<ServiceResponseDto<AuthWithResponseDto<resetEmailSchemaDto>>> {
		const form = await superValidate(event.request, zod(resetEmailSchema));

		const output = this._getDefaultResponseV2<resetEmailSchemaDto>(form);
		if (form.data.token !== tokenUrlParam) {
			output.error = { errorMessage: "We couldn't verify your token.<br>Try again later, if the issue persists consider contact support for help." };
			return output;
		}

		if (!form.valid) return output;

		const resTokenVerification = await SupabaseAuthController.verifyResetPasswordToken(event.locals.database, form.data.token);

		if (resTokenVerification.error || resTokenVerification.response?.error) {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = { errorMessage: "We couldn't verify your token.<br>Try again later, if the issue persists consider contact support for help." };
			return output;
		}

		const resUpdateUser = await SupabaseAuthController.updateUser(event.locals.database, { password: form.data.password });

		if (resUpdateUser.response) {
			output.statusCode = SUCCESSFULL_CODE.OK;
			if (resUpdateUser.response.error) {
				output.statusCode = resUpdateUser.response.error.status ?? SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
				output.error = {
					errorMessage: 'We were unable to reset your password.<br>Please try again, if the issue persists consider contact support for help.'
				};
			}
		} else {
			output.statusCode = SERVER_ERROR_CODE.INTERNAL_SERVER_ERROR;
			output.error = { errorMessage: this.genericError };
		}

		//Confirm email signins the user so we need to signout
		await this.signout(event);

		return output;
	}
}
