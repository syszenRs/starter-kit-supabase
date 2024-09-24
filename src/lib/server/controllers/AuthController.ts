import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { authGenericSchema, confirmEmailSchema } from '$schema/auth';

export class AuthController {
	public static async signin(DBClient: SupabaseClient, data: z.infer<typeof authGenericSchema>) {
		const response = await DBClient.auth.signInWithPassword({
			email: data.email,
			password: data.password
		});

		return response;
	}

	public static async signup(DBClient: SupabaseClient, data: z.infer<typeof authGenericSchema>) {
		const response = await DBClient.auth.signUp({ email: data.email, password: data.password });

		return response;
	}

	public static async signout(DBClient: SupabaseClient) {
		const response = await DBClient.auth.signOut();

		return response;
	}

	public static async confirmEmail(DBClient: SupabaseClient, data: z.infer<typeof confirmEmailSchema>) {
		const response = await DBClient.auth.verifyOtp({
			type: 'signup',
			token: data.code,
			email: data.email
		});

		return response;
	}
}
