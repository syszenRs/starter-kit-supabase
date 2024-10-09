import type { AuthError, Session, User } from '@supabase/supabase-js';
import { type SuperValidated } from 'sveltekit-superforms';

export type AuthSPResponseDto = {
	data: {
		user: User | null;
		session: Session | null;
	};
	error: AuthError | null;
};

export type BaseResponseDto<TForm extends Record<string, unknown>> = {
	statusCode: number;
	form: SuperValidated<TForm>;
	errorMessage?: string;
};
