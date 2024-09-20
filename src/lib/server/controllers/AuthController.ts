import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { loginSchema } from '$schema/auth';

export class AuthController {
	public static async signin(DBClient: SupabaseClient, form: z.infer<typeof loginSchema>) {
		const response = await DBClient.auth.signInWithPassword({
			email: form.email,
			password: form.password
		});

		return response;
	}
}
