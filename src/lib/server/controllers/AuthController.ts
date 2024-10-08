import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { authBaseSchema, emailCodeSchema, emailSchema } from '$schema/auth';
import { BASE_URL } from '$env/static/private';

function handleTryCatchError(error: unknown): string {
	let errorMessage = 'An unknown error occurred';

	if (error instanceof Error) {
		errorMessage = error.message;
	}

	return errorMessage;
}

export class AuthController {
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

	public static async confirmEmail(DBClient: SupabaseClient, data: z.infer<typeof emailCodeSchema>) {
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

	public static async EmailResetPassword(DBClient: SupabaseClient, data: z.infer<typeof emailSchema>) {
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
}
