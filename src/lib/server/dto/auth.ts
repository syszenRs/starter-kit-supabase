import type { AuthError, Session, User } from '@supabase/supabase-js';
import { type SuperValidated } from 'sveltekit-superforms';

export type AuthWithResponseDto<FormType extends Record<string, unknown>> = {
	form: SuperValidated<FormType>;
	response?: {
		data: {
			user: User | null;
			session: Session | null;
		};
		error: AuthError | null;
	};
};
