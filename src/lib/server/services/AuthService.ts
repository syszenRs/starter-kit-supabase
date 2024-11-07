import type { RequestEvent } from '@sveltejs/kit';
import type { AuthWithResponseDto } from '$serverDto/auth';
import type { ServiceOutputResultDto, ServiceOutputDto } from '$serverDto/service';
import type { authBaseSchemaDto, emailCodeSchemaDto, emailSchemaDto, resetEmailSchemaDto } from '$schemaValidate/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authBaseSchema, emailCodeSchema, emailSchema, resetEmailSchema, signupSchema } from '$schemaValidate/auth';
import { SupabaseAuthController } from '$controller/SupabaseAuthController';
import { CLIENT_ERROR_CODE, SERVER_ERROR_CODE, SUCCESSFULL_CODE } from '$constant/http-code';
import { AUTH_ERRORS } from '$constant/supabase-auth';
import { getDefaultServiceOutput, getDefaultServiceResultOutput } from '../utils';
import type { SuperformFormType } from '$serverDto/generic';

type AuthServiceOutputType<FormType extends SuperformFormType> = ServiceOutputResultDto<AuthWithResponseDto<FormType>>;

export class AuthService {
	private static genericError = 'Something bad happen in our side.<br>Please consider contacting support to report.';
	private static TOO_MANY_REQUESTS_ERROR = 'Too many attempts have been made.<br>Please try again later or reset your password if needed.';

	private static _isTooManyRequestsError(status?: number, code?: string) {
		return CLIENT_ERROR_CODE.TOO_MANY_REQUESTS === status || code === AUTH_ERRORS.RATE_LIMIT_EXCEEDED;
	}

	public static async signin({ request, locals }: RequestEvent): AuthServiceOutputType<authBaseSchemaDto> {
		const form = await superValidate(request, zod(authBaseSchema));

		const output = getDefaultServiceResultOutput<AuthWithResponseDto<authBaseSchemaDto>>({
			form,
			response: undefined
		});

		if (!form.valid) return output;

		const res = await SupabaseAuthController.signin(locals.database, form.data);

		if (res.response) {
			const emailNotConfirmed = res.response.error?.code === AUTH_ERRORS.EMAIL_NOT_CONFIRMED;

			output.data.response = res.response;
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

	public static async signup({ request, locals }: RequestEvent): AuthServiceOutputType<authBaseSchemaDto> {
		const form = await superValidate(request, zod(signupSchema));

		const output = getDefaultServiceResultOutput<AuthWithResponseDto<authBaseSchemaDto>>({
			form,
			response: undefined
		});

		if (!form.valid) return output;

		const res = await SupabaseAuthController.signup(locals.database, form.data);

		if (res.response) {
			output.data.response = res.response;
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

	public static async signout({ locals }: RequestEvent): ServiceOutputDto {
		const res = await SupabaseAuthController.signout(locals.database);

		const output = getDefaultServiceOutput();

		const hasError = res.error || res.response?.error;

		output.statusCode = hasError ? CLIENT_ERROR_CODE.BAD_REQUEST : SUCCESSFULL_CODE.OK;
		output.error = {
			errorMessage: hasError ? 'Logout failed. Please try again.<br>If the issue persists, close your browser or contact support for help.' : ''
		};

		return output;
	}

	public static async confirmEmail(event: RequestEvent): AuthServiceOutputType<emailCodeSchemaDto> {
		const form = await superValidate(event.request, zod(emailCodeSchema));

		const output = getDefaultServiceResultOutput<AuthWithResponseDto<emailCodeSchemaDto>>({
			form,
			response: undefined
		});

		if (!form.valid) {
			output.error = {
				errorMessage: form.errors.email ? 'It seems that we lost your email somehow..<br>Please try to sign in, so we can identify you.' : ''
			};
			return output;
		}

		const res = await SupabaseAuthController.verifySignupEmail(event.locals.database, form.data);

		if (res.response) {
			output.data.response = res.response;
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

	public static async resendSignupConfirmCode({ request, locals }: RequestEvent): AuthServiceOutputType<emailSchemaDto> {
		const form = await superValidate(request, zod(emailSchema));

		const output = getDefaultServiceResultOutput<AuthWithResponseDto<emailSchemaDto>>({
			form,
			response: undefined
		});

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

	public static async sendEmailResetPassword({ request, locals }: RequestEvent): AuthServiceOutputType<emailSchemaDto> {
		const form = await superValidate(request, zod(emailSchema));

		const output = getDefaultServiceResultOutput<AuthWithResponseDto<emailSchemaDto>>({
			form,
			response: undefined
		});

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

	public static async resetPassword(event: RequestEvent, tokenUrlParam: string): ServiceOutputResultDto<AuthWithResponseDto<resetEmailSchemaDto>> {
		const form = await superValidate(event.request, zod(resetEmailSchema));

		const output = getDefaultServiceResultOutput<AuthWithResponseDto<resetEmailSchemaDto>>({
			form,
			response: undefined
		});

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
