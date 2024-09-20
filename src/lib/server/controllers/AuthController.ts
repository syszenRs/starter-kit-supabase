import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { loginSchema } from '$schema/auth';
import { LOGIN_ERRORS } from '$constant/supabase-auth';
import { redirect } from '@sveltejs/kit';

export class AuthController {
	public static async signin(DBClient: SupabaseClient, form: z.infer<typeof loginSchema>) {
		const response = await DBClient.auth.signInWithPassword({
			email: form.email,
			password: form.password
		});

		//TODO: SHOULD URL BE HARDCODED ??
		if (response.error?.code == LOGIN_ERRORS.EMAIL_NOT_CONFIRMED)
			throw redirect(303, `/confirm-email?email=${form.email}`);

		return response;
	}
}
