import type { RequestEvent } from '@sveltejs/kit';
import type { SigninResponseDto } from '$dto/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$schema/auth';
import { AuthController } from '$controller/AuthController';
import { CLIENT_ERROR_CODE, SUCCESSFULL_CODE } from '$constant/http-code';

export class AuthService {
	public static async signin({ request, locals }: RequestEvent): Promise<SigninResponseDto> {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) return { errorCode: CLIENT_ERROR_CODE.BAD_REQUEST, form };

		const response = await AuthController.signin(locals.database, form.data);

		return {
			errorCode: response.error?.status ?? SUCCESSFULL_CODE.OK,
			form,
			response
		};
	}
}
