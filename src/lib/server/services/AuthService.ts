import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import type { RequestEvent } from '@sveltejs/kit';
import { superValidate, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { loginSchema } from '$schema/auth';
import { AuthController } from '$controller/AuthController';

type SigninResponse = {
	errorCode: number;
	form: SuperValidated<z.infer<typeof loginSchema>>;
	response?: AuthTokenResponsePassword;
};

export class AuthService {
	public static async signin({ request, locals }: RequestEvent): Promise<SigninResponse> {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return { errorCode: 400, form };
		}

		const response = await AuthController.signin(locals.database, form.data);

		return {
			errorCode: response.error ? 400 : 200,
			response,
			form
		};
	}
}
