import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { authBaseSchema, emailCodeSchema, emailSchema } from '$schemaValidate/auth';
import { BASE_URL } from '$env/static/private';
import { handleTryCatchError } from '$lib/utils/error';

type userDataDto = {
	email?: string;
	password?: string;
};

export class SupabaseAuthController {
	public static async signin(DBClient: SupabaseClient, data: z.infer<typeof authBaseSchema>) {
		try {
			const response = await DBClient.auth.signInWithPassword({
				email: data.email,
				password: data.password
			});
			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async signup(DBClient: SupabaseClient, data: z.infer<typeof authBaseSchema>) {
		try {
			const response = await DBClient.auth.signUp({ email: data.email, password: data.password });
			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async signout(DBClient: SupabaseClient) {
		try {
			const response = await DBClient.auth.signOut();
			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async verifySignupEmail(DBClient: SupabaseClient, data: z.infer<typeof emailCodeSchema>) {
		try {
			const response = await DBClient.auth.verifyOtp({
				type: 'signup',
				token: data.code,
				email: data.email
			});

			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async resendSignupConfirmCode(DBClient: SupabaseClient, data: z.infer<typeof emailSchema>) {
		try {
			const response = await DBClient.auth.resend({
				type: 'signup',
				email: data.email
			});

			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async sendEmailResetPassword(DBClient: SupabaseClient, data: z.infer<typeof emailSchema>) {
		try {
			const response = await DBClient.auth.resetPasswordForEmail(data.email, {
				redirectTo: BASE_URL + '/set-new-password'
			});

			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async verifyResetPasswordToken(DBClient: SupabaseClient, token: string) {
		try {
			const response = await DBClient.auth.verifyOtp({
				token_hash: token,
				type: 'recovery'
			});

			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async updateUser(DBClient: SupabaseClient, userData: userDataDto) {
		if (!userData.email && !userData.password)
			return {
				response: null,
				error: 'No email or password provided'
			};

		try {
			const response = await DBClient.auth.updateUser(userData);

			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}
}
