import type { AuthError, Session, User } from '@supabase/supabase-js';
import { type SuperValidated } from 'sveltekit-superforms';
import { z } from 'zod';
import { authGenericSchema, confirmEmailSchema } from '$schema/auth';

type AuthSPResponseDto = {
	data: {
		user: User | null;
		session: Session | null;
	};
	error: AuthError | null;
};

export type AuthResponseDto = {
	errorCode: number;
	form: SuperValidated<z.infer<typeof authGenericSchema>>;
	errorMessage?: string;
	response?: AuthSPResponseDto;
};

export type ConfirmEmailResponseDto = {
	errorCode: number;
	form: SuperValidated<z.infer<typeof confirmEmailSchema>>;
	errorMessage?: string;
	response?: AuthSPResponseDto;
};
