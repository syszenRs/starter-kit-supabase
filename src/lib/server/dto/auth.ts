import type { AuthError, Session, User } from '@supabase/supabase-js';
import { type SuperValidated } from 'sveltekit-superforms';
import { z } from 'zod';
import { authBaseSchema, emailCodeSchema, emailSchema } from '$schema/auth';

type AuthSPResponseDto = {
	data: {
		user: User | null;
		session: Session | null;
	};
	error: AuthError | null;
};

type BaseResponseDto<TForm extends Record<string, unknown>> = {
	statusCode: number;
	form: SuperValidated<TForm>;
	errorMessage?: string;
};

export type AuthResponseDto = BaseResponseDto<z.infer<typeof authBaseSchema>> & {
	response?: AuthSPResponseDto;
};

export type ConfirmEmailResponseDto = BaseResponseDto<z.infer<typeof emailCodeSchema>> & {
	response?: AuthSPResponseDto;
};

export type ResetEmailResponseDto = BaseResponseDto<z.infer<typeof emailSchema>>;
